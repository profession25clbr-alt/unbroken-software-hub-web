// Punto de entrada para renderizar la landing a HTML en Node (prerender).
// Lo compila `vite build --ssr` y lo usa scripts/prerender.mjs; no forma parte del
// bundle que descarga el navegador.
import { renderToString } from "react-dom/server"
import App from "./App.jsx"

export function render() {
  return renderToString(<App />)
}
