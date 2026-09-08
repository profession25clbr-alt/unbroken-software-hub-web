// Script de prueba manual: NO se ejecuta en producción ni en CI.
// Sirve para agotar a propósito la cuota diaria del modelo principal
// (gemini-3.5-flash-lite, 500 RPD) y confirmar que server/index.js cambia
// solo al fallback (Gemma) cuando la API devuelve 429.
//
// Cómo usarlo:
//   1. En una terminal: npm run server   (deja esa consola a la vista)
//   2. En otra terminal: npm run test:fallback
//   3. El progreso se ve en consola y queda guardado en server/test-fallback.log
//      para revisar después si un error fue esperado (fin de cadena) o distinto.
//   4. Apenas el contador de gemini-3.5-flash-lite llegue a 0 disponibles y el
//      modelo activo cambie a un Gemma, ya quedó demostrado que el fallback
//      funciona -> se puede cortar con Ctrl+C (imprime el resumen antes de salir).

import { appendFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const LOG_FILE = join(__dirname, "test-fallback.log")

const CHAT_ENDPOINT = process.env.TEST_CHAT_URL || "http://localhost:8787/api/chat"

// El límite por minuto (RPM) de gemini-3.5-flash-lite no está confirmado acá
// (la tabla que maneja el proyecto solo trae RPD y TPM) - revisar el panel de
// cuotas de Google AI Studio para el número exacto. 12s = 5 pedidos/min es un
// ritmo conservador para no gatillar un 429 por RPM en vez de por RPD real.
const DELAY_MS = Number(process.env.TEST_DELAY_MS || 12000)

// Tope de seguridad: un poco más de 500 para alcanzar a ver el primer cambio
// de modelo aunque el conteo del día ya traiga algo consumido, sin quedar
// corriendo indefinidamente si algo no dispara como se espera.
const MAX_REQUESTS = Number(process.env.TEST_MAX_REQUESTS || 520)

// Límites diarios (RPD) documentados para la cadena de fallback del proyecto.
const RPD_LIMITS = {
  "gemini-3.5-flash-lite": 500,
  "gemma-4-26b-a4b-it": 14400,
  "gemma-4-31b-it": 14400,
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const counters = {} // { [model]: { ok: n, fail: n } }
const bump = (model, kind) => {
  const key = model || "desconocido"
  counters[key] ??= { ok: 0, fail: 0 }
  counters[key][kind]++
  return counters[key]
}

const log = (line) => {
  console.log(line)
  appendFileSync(LOG_FILE, line + "\n")
}

writeFileSync(
  LOG_FILE,
  `=== Prueba de fallback iniciada ${new Date().toISOString()} ===\n` +
    `Endpoint: ${CHAT_ENDPOINT} | delay=${DELAY_MS}ms | max=${MAX_REQUESTS}\n\n`
)

console.log(
  `Probando fallback contra ${CHAT_ENDPOINT} — 1 pedido cada ${DELAY_MS / 1000}s, máx. ${MAX_REQUESTS}.\n` +
    `Log detallado en: ${LOG_FILE}\n`
)

let lastModel = null

const printSummary = () => {
  const resumen = ["", "--- Resumen ---"]
  for (const [model, c] of Object.entries(counters)) {
    const limite = RPD_LIMITS[model]
    const disponibles = limite != null ? Math.max(limite - c.ok, 0) : "?"
    resumen.push(`${model}: usadas=${c.ok} fallidas=${c.fail} disponibles≈${disponibles}/${limite ?? "?"}`)
  }
  const texto = resumen.join("\n")
  console.log(texto)
  appendFileSync(LOG_FILE, texto + "\n")
}

process.on("SIGINT", () => {
  printSummary()
  process.exit(0)
})

for (let i = 1; i <= MAX_REQUESTS; i++) {
  try {
    const res = await fetch(CHAT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "test", history: [] }),
    })
    const data = await res.json().catch(() => ({}))
    const model = data.model || null

    if (model && model !== lastModel) {
      log(`>>> Cambio de modelo activo: ${lastModel ?? "(ninguno)"} -> ${model}`)
      lastModel = model
    }

    if (res.ok) {
      const c = bump(model, "ok")
      const limite = RPD_LIMITS[model]
      const disponibles = limite != null ? Math.max(limite - c.ok, 0) : "?"
      log(`[${i}/${MAX_REQUESTS}] OK modelo=${model} usadas=${c.ok} disponibles≈${disponibles}/${limite ?? "?"}`)
    } else {
      const c = bump(model, "fail")
      // 502 después de ya haber tenido éxitos previos = esperado (la cadena
      // completa se quedó sin cupo). 502/400 desde la primera vuelta, o
      // cualquier status que no sea 200/502, es "revisar" (no es el patrón
      // de agotamiento gradual que se busca reproducir acá).
      const esperado = res.status === 502 && Object.values(counters).some((x) => x.ok > 0)
      const etiqueta = esperado ? "ESPERADO (fin de cadena)" : "REVISAR"
      log(`[${i}/${MAX_REQUESTS}] FALLO status=${res.status} modelo=${model ?? "?"} -> ${etiqueta}: ${data.error ?? "sin detalle"}`)
    }
  } catch (err) {
    bump("desconocido", "fail")
    log(`[${i}/${MAX_REQUESTS}] ERROR DE RED -> REVISAR: ${err.message}`)
  }

  if (i < MAX_REQUESTS) await sleep(DELAY_MS)
}

printSummary()
