// Prueba manual de carga: NO se ejecuta en producción ni en CI.
// Simula 5 visitantes (5 IPs distintas vía X-Forwarded-For) conversando con el
// chat durante 1 minuto, para ver cómo se comporta la cadena de modelos cuando
// se supera el límite por minuto de Gemini Flash Lite (15 RPM).
//
// Ritmo por defecto: cada visitante manda 1 mensaje cada 12 s, escalonados 2,4 s
// entre sí -> 5 mensajes c/u = 25 peticiones en ~60 s (~25 RPM, más de los 15
// de Flash Lite, así que debería empezar a caer en los Gemma).
//
// Cómo usarlo (el servidor debe tener TRUST_PROXY=1 para leer X-Forwarded-For):
//   1. PORT=8798 TRUST_PROXY=1 node server/index.js
//   2. TEST_CHAT_URL=http://localhost:8798/api/chat node server/test-carga.mjs
//   El resultado queda en server/test-carga.log

import { appendFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const LOG_FILE = join(__dirname, "test-carga.log")

const CHAT_ENDPOINT = process.env.TEST_CHAT_URL || "http://localhost:8798/api/chat"
const USERS = Number(process.env.TEST_USERS || 5)
const INTERVAL_MS = Number(process.env.TEST_INTERVAL_MS || 12000)
const MSGS_PER_USER = Number(process.env.TEST_MSGS || 5)
const STAGGER_MS = Math.round(INTERVAL_MS / USERS)

const PREGUNTAS = [
  "Hola, qué servicios ofrecen?",
  "Hacen páginas web para restaurantes?",
  "Cómo es el proceso de trabajo?",
  "Pueden automatizar mensajes por WhatsApp?",
  "Cuánto cuesta una página web?",
  "Trabajan con Python o FastAPI?",
  "Qué es lo de inteligencia artificial aplicada?",
  "Cómo los contacto?",
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const t0 = Date.now()
const rel = () => ((Date.now() - t0) / 1000).toFixed(1).padStart(5)

const resultados = []

const log = (line) => {
  console.log(line)
  appendFileSync(LOG_FILE, line + "\n")
}

writeFileSync(
  LOG_FILE,
  `=== Prueba de carga iniciada ${new Date().toISOString()} ===\n` +
    `Endpoint: ${CHAT_ENDPOINT} | usuarios=${USERS} | 1 mensaje cada ${INTERVAL_MS / 1000}s | ${MSGS_PER_USER} c/u\n\n`
)

async function visitante(n) {
  const ip = `10.20.30.${n}`
  await sleep((n - 1) * STAGGER_MS)
  const history = []

  for (let i = 0; i < MSGS_PER_USER; i++) {
    const message = PREGUNTAS[(n * 3 + i) % PREGUNTAS.length]
    const inicio = Date.now()
    let status = 0
    let model = "-"
    let detalle = ""
    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Forwarded-For": ip },
        body: JSON.stringify({ message, history }),
      })
      status = res.status
      const data = await res.json().catch(() => ({}))
      model = data.model || "-"
      detalle = data.error ? ` error="${data.error}"` : ""
      if (res.ok && data.reply) {
        history.push({ role: "user", text: message }, { role: "model", text: data.reply })
      }
    } catch (err) {
      detalle = ` red="${err.message}"`
    }
    const ms = Date.now() - inicio
    resultados.push({ user: n, status, model, ms, t: (inicio - t0) / 1000 })
    log(`[t=${rel()}s] usuario ${n} msg ${i + 1}/${MSGS_PER_USER} -> HTTP ${status} modelo=${model} ${ms}ms${detalle}`)

    if (i < MSGS_PER_USER - 1) await sleep(INTERVAL_MS)
  }
}

console.log(`Simulando ${USERS} visitantes, 1 mensaje cada ${INTERVAL_MS / 1000}s, contra ${CHAT_ENDPOINT}\n`)
await Promise.all(Array.from({ length: USERS }, (_, i) => visitante(i + 1)))

// --- Resumen ---
const porModelo = {}
for (const r of resultados) {
  const k = r.status === 200 ? r.model : `HTTP ${r.status}`
  porModelo[k] = (porModelo[k] ?? 0) + 1
}
const okMs = resultados.filter((r) => r.status === 200).map((r) => r.ms).sort((a, b) => a - b)
const p = (q) => (okMs.length ? okMs[Math.min(okMs.length - 1, Math.floor(okMs.length * q))] : 0)

const resumen = [
  "",
  "--- Resumen ---",
  `Peticiones: ${resultados.length} | duración total: ${((Date.now() - t0) / 1000).toFixed(1)}s`,
  ...Object.entries(porModelo).map(([k, v]) => `  ${k}: ${v}`),
  `Latencia de las respuestas OK: mediana ${p(0.5)}ms | p90 ${p(0.9)}ms | máx ${okMs.at(-1) ?? 0}ms`,
]
const cambios = []
let prev = null
for (const r of [...resultados].sort((a, b) => a.t - b.t)) {
  if (r.status === 200 && r.model !== prev) {
    cambios.push(`  t=${r.t.toFixed(1)}s -> ${r.model}`)
    prev = r.model
  }
}
resumen.push("Cambios de modelo activo (por orden de llegada):", ...cambios)

const texto = resumen.join("\n")
console.log(texto)
appendFileSync(LOG_FILE, texto + "\n")
