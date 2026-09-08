import "dotenv/config"
import express from "express"
import cors from "cors"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))

const PORT = process.env.PORT || 8787
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:5173"
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const PRIMARY_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite"

// Cada modelo tiene su propia cuota gratis independiente. Si el principal
// se queda sin cupo (429) se pasa al siguiente de la lista en vez de fallar.
// Los Gemma tienen cuota diaria mucho más generosa, por eso van de respaldo.
const MODEL_CHAIN = [...new Set([PRIMARY_MODEL, "gemma-4-26b-a4b-it", "gemma-4-31b-it"])]

if (!GEMINI_API_KEY) {
  console.error(
    "Falta GEMINI_API_KEY. Crea un archivo .env en la raíz del proyecto " +
      "(puedes copiar .env.example) con tu clave de Google AI Studio."
  )
  process.exit(1)
}

const companyContext = readFileSync(join(__dirname, "context", "company.md"), "utf-8")

const SYSTEM_INSTRUCTION = `Eres el asistente virtual del sitio web de Everforged Software.
Tu única fuente de información es el siguiente documento. No tienes acceso a
ningún otro sistema, archivo, computador o dato fuera de este texto.

--- INICIO DEL CONTEXTO ---
${companyContext}
--- FIN DEL CONTEXTO ---`

const MAX_MESSAGE_LENGTH = 800
const MAX_HISTORY_TURNS = 8

const app = express()
app.use(cors({ origin: ALLOWED_ORIGIN }))
app.use(express.json({ limit: "20kb" }))

app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body ?? {}

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Falta el mensaje." })
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ error: "Mensaje demasiado largo." })
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
    let response
    let usedModel

    for (const model of MODEL_CHAIN) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`

      // El tier gratis devuelve 503 "high demand" de vez en cuando, se
      // recupera solo en un par de segundos: reintentamos antes de rendirnos.
      for (let attempt = 0; attempt < 3; attempt++) {
        response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody,
        })
        if (response.ok || response.status !== 503) break
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)))
      }

      usedModel = model
      // 429 = se acabó la cuota de ESTE modelo puntual. Como cada modelo
      // tiene su propia cuota independiente, se prueba el siguiente en vez
      // de devolver error al visitante.
      if (response.status !== 429) break
      console.warn(`Cuota agotada en ${model}, probando siguiente modelo del fallback.`)
    }

    if (!response.ok) {
      const detail = await response.text()
      console.error(`Gemini API error (${usedModel}):`, response.status, detail)
      return res.status(502).json({ error: "El asistente no está disponible en este momento.", model: usedModel })
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
      return res.status(502).json({ error: "El asistente no pudo generar una respuesta.", model: usedModel })
    }

    // "model" queda expuesto solo para depuración/pruebas (ver test-fallback.mjs);
    // el ChatWidget lo ignora, solo lee "reply".
    res.json({ reply, model: usedModel })
  } catch (err) {
    console.error("Error llamando a Gemini:", err)
    res.status(502).json({ error: "El asistente no está disponible en este momento." })
  }
})

app.listen(PORT, () => {
  console.log(`Chat server escuchando en http://localhost:${PORT} (origen permitido: ${ALLOWED_ORIGIN})`)
})
