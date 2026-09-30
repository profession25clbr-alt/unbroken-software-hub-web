import "dotenv/config"
import express from "express"
import cors from "cors"
import rateLimit from "express-rate-limit"
import { existsSync, readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST_DIR = join(__dirname, "..", "dist")

const PORT = process.env.PORT || 8787
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:5173"
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

// Cadena de modelos por prioridad. Cada modelo tiene su propia cuota gratis
// independiente: si el primero se queda sin cupo (429) se pasa al siguiente en
// vez de fallar. Los Gemma tienen cuota mucho más generosa, por eso van de respaldo.
// GEMINI_MODELS = lista separada por comas (así se cambia el orden sin tocar
// código). Sin esa variable se usa la cadena por defecto (la recomendada tras las
// pruebas, ver docs/modelos-ia-limites.md).
const DEFAULT_CHAIN = ["gemini-3.5-flash-lite", "gemini-2.5-flash", "gemini-3.6-flash", "gemma-4-31b-it"]
const MODEL_CHAIN = process.env.GEMINI_MODELS
  ? [...new Set(process.env.GEMINI_MODELS.split(",").map((m) => m.trim()).filter(Boolean))]
  : DEFAULT_CHAIN

if (!GEMINI_API_KEY) {
  console.error(
    "Falta GEMINI_API_KEY. Crea un archivo .env en la raíz del proyecto " +
      "(puedes copiar .env.example) con tu clave de Google AI Studio."
  )
  process.exit(1)
}
if (MODEL_CHAIN.length === 0) {
  console.error("GEMINI_MODELS no contiene ningún modelo.")
  process.exit(1)
}

const companyContext = readFileSync(join(__dirname, "context", "company.md"), "utf-8")

const SYSTEM_INSTRUCTION = `Eres el asistente virtual del sitio web de Unbroken Software Hub.
Tu única fuente de información es el siguiente documento. No tienes acceso a
ningún otro sistema, archivo, computador o dato fuera de este texto.

--- INICIO DEL CONTEXTO ---
${companyContext}
--- FIN DEL CONTEXTO ---`

const MAX_MESSAGE_LENGTH = 800
const MAX_HISTORY_TURNS = 8

// Límite por IP: Flash Lite permite 15 por minuto en total para TODOS los
// visitantes, así que se deja 10 por IP para no agotarlo con una sola persona.
const RATE_LIMIT_PER_MINUTE = Number(process.env.CHAT_RATE_LIMIT || 10)

// Tiempo mínimo de una respuesta. Si Gemini contesta antes, se espera el resto;
// si tarda más (conexión lenta), no se agrega ningún retraso extra.
const MIN_RESPONSE_MS = Number(process.env.CHAT_MIN_RESPONSE_MS || 2000)

// Un modelo que devolvió 429 se salta durante este tiempo, sin gastar otra
// petición para enterarse de lo mismo.
const COOLDOWN_MS = 60_000
// Un modelo que falló con 5xx se salta menos tiempo: suele ser un error pasajero.
const ERROR_COOLDOWN_MS = 15_000
const cooldownUntil = new Map()

// Tope de espera por intento. En pruebas gemma-4-31b-it llegó a tardar 57 s
// (nginx corta a los 60 s): si un modelo no responde a tiempo se pasa al siguiente.
const GEMINI_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS || 15000)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const app = express()
// Detrás de nginx la IP real viene en X-Forwarded-For; sin esto el rate limit
// vería siempre 127.0.0.1 y todos los visitantes compartirían un solo cupo.
app.set("trust proxy", Number(process.env.TRUST_PROXY || 0))
app.use(cors({ origin: ALLOWED_ORIGIN }))
app.use(express.json({ limit: "20kb" }))

app.get("/healthz", (_req, res) => res.type("text/plain").send("ok"))

const chatLimiter = rateLimit({
  windowMs: 60_000,
  limit: RATE_LIMIT_PER_MINUTE,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas preguntas seguidas. Espera un momento." },
})

async function llamarGemini(model, requestBody) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
  let response

  // El tier gratis devuelve 503 "high demand" de vez en cuando, se recupera
  // solo en un par de segundos: reintentamos antes de rendirnos.
  for (let attempt = 0; attempt < 3; attempt++) {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": GEMINI_API_KEY },
      body: requestBody,
      signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
    })
    if (response.ok || response.status !== 503) break
    await sleep(1000 * (attempt + 1))
  }
  return response
}

app.post("/api/chat", chatLimiter, async (req, res) => {
  const { message, history } = req.body ?? {}

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Falta el mensaje." })
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ error: "Mensaje demasiado largo." })
  }

  const started = Date.now()
  const responder = async (status, body) => {
    const restante = MIN_RESPONSE_MS - (Date.now() - started)
    if (restante > 0) await sleep(restante)
    return res.status(status).json(body)
  }

  const safeHistory = Array.isArray(history)
    ? history
        .filter((h) => h && (h.role === "user" || h.role === "model") && typeof h.text === "string")
        .slice(-MAX_HISTORY_TURNS)
        .map((h) => ({ role: h.role, parts: [{ text: h.text.slice(0, MAX_MESSAGE_LENGTH) }] }))
    : []

  const contents = [...safeHistory, { role: "user", parts: [{ text: message }] }]
  const requestBody = JSON.stringify({
    systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
    contents,
    generationConfig: {
      maxOutputTokens: 2048,
      temperature: 0.4,
    },
  })

  try {
    // Se saltan los modelos en enfriamiento; si TODOS lo están se intenta la
    // cadena completa igual, porque el cupo pudo haberse liberado antes de tiempo.
    const ahora = Date.now()
    const disponibles = MODEL_CHAIN.filter((m) => (cooldownUntil.get(m) ?? 0) <= ahora)
    const candidatos = disponibles.length > 0 ? disponibles : MODEL_CHAIN

    let response
    let usedModel

    for (const [i, model] of candidatos.entries()) {
      try {
        response = await llamarGemini(model, requestBody)
      } catch (err) {
        // Timeout o corte de red: se trata como un 504 de ESTE modelo.
        console.warn(`${model} no respondió (${err.name}).`)
        response = new Response(null, { status: 504 })
      }
      usedModel = model

      // 429 = se acabó la cuota de ESTE modelo puntual; 5xx = el modelo falló
      // (los Gemma devuelven 500 "Internal error" de a ratos). En los dos casos se
      // prueba el siguiente en vez de devolver error al visitante.
      if (response.status !== 429 && response.status < 500) break
      const enfriamiento = response.status === 429 ? COOLDOWN_MS : ERROR_COOLDOWN_MS
      cooldownUntil.set(model, Date.now() + enfriamiento)
      console.warn(`${model} devolvió ${response.status}, en enfriamiento ${enfriamiento / 1000}s. Probando siguiente modelo.`)
      if (i < candidatos.length - 1) await response.body?.cancel()
    }

    if (!response.ok) {
      const detail = await response.text()
      console.error(`Gemini API error (${usedModel}):`, response.status, detail)
      return responder(502, { error: "El asistente no está disponible en este momento.", model: usedModel })
    }

    const data = await response.json()
    const candidate = data.candidates?.[0]
    const reply =
      candidate?.content?.parts
        ?.filter((p) => !p.thought)
        .map((p) => p.text)
        .join("") ?? ""

    if (candidate?.finishReason === "MAX_TOKENS") {
      console.warn("Respuesta cortada por maxOutputTokens, subir el límite si se repite.")
    }

    if (!reply) {
      return responder(502, { error: "El asistente no pudo generar una respuesta.", model: usedModel })
    }

    // "model" queda expuesto solo para depuración/pruebas (ver test-fallback.mjs);
    // el ChatWidget lo ignora, solo lee "reply".
    return responder(200, { reply, model: usedModel })
  } catch (err) {
    console.error("Error llamando a Gemini:", err)
    return responder(502, { error: "El asistente no está disponible en este momento." })
  }
})

// En producción el mismo proceso sirve la landing compilada (mismo origen que el
// chat, sin CORS). En desarrollo no existe dist/ y esto no se monta: ahí corre Vite.
if (existsSync(DIST_DIR)) {
  app.use(
    express.static(DIST_DIR, {
      setHeaders(res, filePath) {
        // Los archivos de /assets llevan hash en el nombre: se pueden cachear sin miedo.
        // El index.html no, para que un deploy nuevo se vea de inmediato.
        res.setHeader(
          "Cache-Control",
          filePath.includes(`${join(DIST_DIR, "assets")}`) ? "public, max-age=31536000, immutable" : "no-cache"
        )
      },
    })
  )
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api/")) return next()
    res.setHeader("Cache-Control", "no-cache")
    res.sendFile(join(DIST_DIR, "index.html"))
  })
}

app.listen(PORT, () => {
  console.log(
    `Servidor escuchando en el puerto ${PORT} (modelos: ${MODEL_CHAIN.join(" > ")}; ` +
      `límite ${RATE_LIMIT_PER_MINUTE}/min por IP; sirviendo dist: ${existsSync(DIST_DIR)})`
  )
})
