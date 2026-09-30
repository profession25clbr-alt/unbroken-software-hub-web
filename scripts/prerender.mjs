// Prerender: después de `vite build` (cliente) y `vite build --ssr` (servidor), genera
// el HTML de la landing y lo escribe dentro de dist/index.html.
//
// Por qué: sin esto el <body> llega vacío (<div id="root"></div>) y todo el texto lo
// dibuja JavaScript. Googlebot ejecuta JS, pero los rastreadores de IA (GPTBot,
// PerplexityBot, ClaudeBot) no: ven una página en blanco. Con el HTML ya armado leen
// el <h1>, los servicios y las preguntas frecuentes sin ejecutar nada.
//
// En el navegador, main.jsx monta React con createRoot sobre #root: reemplaza este
// HTML por la app viva, así que no hay hidratación ni riesgo de desajustes.

import { readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { FAQ } from "../src/content/faq.js"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const indexPath = join(root, "dist", "index.html")
const serverEntry = pathToFileURL(join(root, "dist-ssr", "entry-server.js")).href

const { render } = await import(serverEntry)
const appHtml = render()

let html = readFileSync(indexPath, "utf-8")

const MARKER = '<div id="root"></div>'
if (!html.includes(MARKER)) {
  console.error(`prerender: no se encontró ${MARKER} en dist/index.html`)
  process.exit(1)
}
html = html.replace(MARKER, `<div id="root">${appHtml}</div>`)

// Datos estructurados FAQPage, con las mismas preguntas que muestra la sección.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
}
// "<" escapado para que ningún texto pueda cerrar el <script>.
const faqScript = `<script type="application/ld+json">${JSON.stringify(faqJsonLd).replace(/</g, "\\u003c")}</script>`
html = html.replace("</head>", `    ${faqScript}\n  </head>`)

writeFileSync(indexPath, html)

const textoPlano = appHtml.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
console.log(
  `prerender: dist/index.html con ${(appHtml.length / 1024).toFixed(0)} KB de HTML, ` +
    `${textoPlano.split(" ").length} palabras, ${(appHtml.match(/<h[1-3]\b/g) ?? []).length} encabezados, ` +
    `${FAQ.length} preguntas frecuentes.`
)
