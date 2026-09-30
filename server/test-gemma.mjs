// Prueba manual: NO se ejecuta en producción ni en CI.
// Aísla por qué los Gemma de la API devuelven a veces 500 "Internal error".
// Llama directo a la API de Gemini (sin pasar por server/index.js) con variantes
// de la misma petición, secuenciales y una ronda concurrente, para cada modelo.
//
//   node server/test-gemma.mjs            (requiere GEMINI_API_KEY en .env)
//   Resultado en consola y en server/test-gemma.log

import "dotenv/config"
import { appendFileSync, readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const LOG_FILE = join(__dirname, "test-gemma.log")
const KEY = process.env.GEMINI_API_KEY
if (!KEY) {
  console.error("Falta GEMINI_API_KEY")
  process.exit(1)
}

const MODELS = (process.env.TEST_MODELS || "gemma-4-26b-a4b-it,gemma-4-31b-it").split(",")
const N = Number(process.env.TEST_N || 6)
const GAP_MS = Number(process.env.TEST_GAP_MS || 2500)
const TIMEOUT_MS = Number(process.env.TEST_TIMEOUT_MS || 60000)

const company = readFileSync(join(__dirname, "context", "company.md"), "utf-8")
const SYSTEM = `Eres el asistente virtual del sitio web de Unbroken Software Hub.
Tu única fuente de información es el siguiente documento.

--- INICIO DEL CONTEXTO ---
${company}
--- FIN DEL CONTEXTO ---`

const HISTORY = [
  { role: "user", parts: [{ text: "Hola, qué servicios ofrecen?" }] },
  { role: "model", parts: [{ text: "Hacemos sistemas a medida, páginas web y automatización." }] },
]
const Q = { role: "user", parts: [{ text: "Trabajan con Python o FastAPI?" }] }
const GEN = { maxOutputTokens: 2048, temperature: 0.4 }

// Variantes: qué cambia respecto de la petición "base" de producción.
const VARIANTES = {
  "A base (systemInstruction, 1 turno)": () => ({ systemInstruction: { parts: [{ text: SYSTEM }] }, contents: [Q], generationConfig: GEN }),
  "B con historial (systemInstruction, 3 turnos)": () => ({ systemInstruction: { parts: [{ text: SYSTEM }] }, contents: [...HISTORY, Q], generationConfig: GEN }),
  "C sin systemInstruction (contexto en el 1er mensaje)": () => ({
    contents: [{ role: "user", parts: [{ text: SYSTEM + "\n\nPregunta: " + Q.parts[0].text }] }],
    generationConfig: GEN,
  }),
  "D base sin generationConfig": () => ({ systemInstruction: { parts: [{ text: SYSTEM }] }, contents: [Q] }),
  "F base + thinkingBudget 0 (sin razonamiento)": () => ({
    systemInstruction: { parts: [{ text: SYSTEM }] },
    contents: [Q],
    generationConfig: { ...GEN, thinkingConfig: { thinkingBudget: 0 } },
  }),
  "H mínima (solo 'Hola', sin system ni config)": () => ({ contents: [{ role: "user", parts: [{ text: "Hola" }] }] }),
  "G base + thinkingLevel minimal": () => ({
    systemInstruction: { parts: [{ text: SYSTEM }] },
    contents: [Q],
    generationConfig: { ...GEN, thinkingConfig: { thinkingLevel: "minimal" } },
  }),
}

// TEST_ONLY=F,G corre solo esas variantes (por la letra inicial del nombre).
const ONLY = (process.env.TEST_ONLY || "").split(",").filter(Boolean)
for (const nombre of Object.keys(VARIANTES)) {
  if (ONLY.length && !ONLY.includes(nombre[0])) delete VARIANTES[nombre]
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const log = (l) => {
  console.log(l)
  appendFileSync(LOG_FILE, l + "\n")
}

async function llamar(model, body) {
  const t = Date.now()
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    const ms = Date.now() - t
    if (res.ok) {
      const d = await res.json()
      const txt = d.candidates?.[0]?.content?.parts?.filter((p) => !p.thought).map((p) => p.text).join("") ?? ""
      const pensados = d.usageMetadata?.thoughtsTokenCount
      const nota = (txt.length ? `${txt.length} car.` : "respuesta vacía") + (pensados != null ? `, ${pensados} tokens de razonamiento` : "")
      return { ok: txt.length > 0, status: res.status, ms, nota }
    }
    const e = await res.text()
    let msg = e
    try { msg = JSON.parse(e).error?.message ?? e } catch {}
    return { ok: false, status: res.status, ms, nota: msg.replace(/\s+/g, " ").slice(0, 90) }
  } catch (err) {
    return { ok: false, status: 0, ms: Date.now() - t, nota: err.name }
  }
}

const pct = (a, q) => (a.length ? a[Math.min(a.length - 1, Math.floor(a.length * q))] : 0)
const resumen = []

writeFileSync(LOG_FILE, `=== Prueba de Gemma iniciada ${new Date().toISOString()} | ${N} por variante, ${GAP_MS}ms entre peticiones ===\n\n`)

for (const model of MODELS) {
  log(`\n##### ${model}`)
  for (const [nombre, armar] of Object.entries(VARIANTES)) {
    const res = []
    for (let i = 0; i < N; i++) {
      res.push(await llamar(model, armar()))
      await sleep(GAP_MS)
    }
    const ok = res.filter((r) => r.ok)
    const errs = {}
    res.filter((r) => !r.ok).forEach((r) => (errs[`${r.status} ${r.nota}`] = (errs[`${r.status} ${r.nota}`] ?? 0) + 1))
    const lat = ok.map((r) => r.ms).sort((a, b) => a - b)
    const linea = `${nombre}: ${ok.length}/${N} OK | latencia mediana ${pct(lat, 0.5)}ms, máx ${lat.at(-1) ?? 0}ms${
      Object.keys(errs).length ? " | errores: " + JSON.stringify(errs) : ""
    }`
    log(linea)
    resumen.push(`${model} | ${linea}`)
  }

  // Ronda concurrente: 5 peticiones a la vez con la primera variante corrida
  // (la base por defecto). TEST_NOCONC=1 la omite.
  if (!process.env.TEST_NOCONC) {
    const [nombreConc, armarConc] = Object.entries(VARIANTES)[0]
    const t = Date.now()
    const conc = await Promise.all(Array.from({ length: 5 }, () => llamar(model, armarConc())))
    const okc = conc.filter((r) => r.ok).length
    const linea = `E concurrente (5 a la vez, ${nombreConc[0]}): ${okc}/5 OK en ${Date.now() - t}ms | ${conc.map((r) => `${r.status}/${r.ms}ms`).join(" ")}`
    log(linea)
    resumen.push(`${model} | ${linea}`)
  }
}

log("\n--- Resumen ---")
resumen.forEach((l) => log(l))
