import { useEffect, useRef, useState } from "react"
import { HiOutlineSwatch } from "react-icons/hi2"

const THEMES = [
  { id: "forge", label: "Forge" },
  { id: "forge-light", label: "Forge claro" },
  { id: "volt", label: "Volt" },
  { id: "volt-light", label: "Volt claro" },
  { id: "toxic", label: "Toxic" },
  { id: "toxic-light", label: "Toxic claro" },
  { id: "royal", label: "Royal" },
  { id: "royal-light", label: "Royal claro" },
]
const STORAGE_KEY = "unbroken-theme"
const AUTO_CHANGE_INTERVAL = 30000

export default function ThemeSwitcher() {
  // El tema ya viene aplicado por el script inline de index.html, así que acá
  // solo se lee del DOM en vez de volver a escribirlo (evita el parpadeo).
  const [index, setIndex] = useState(() => {
    if (typeof document === "undefined") return 0
    const current = document.documentElement.getAttribute("data-theme")
    const found = THEMES.findIndex((t) => t.id === current)
    return found === -1 ? 0 : found
  })
  const [showLabel, setShowLabel] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const indexRef = useRef(index)
  const labelTimer = useRef(null)
  const transitionTimer = useRef(null)
  const autoTimer = useRef(null)

  // El auto-cambio corre en un setInterval que vive fuera del ciclo de
  // render: usa esta ref (no el state) para no quedar con un índice viejo.
  useEffect(() => {
    indexRef.current = index
  }, [index])

  const cycleTheme = () => {
    const next = (indexRef.current + 1) % THEMES.length
    const root = document.documentElement

    // El crossfade se activa solo durante el cambio de paleta.
    root.classList.add("theme-transition")
    root.setAttribute("data-theme", THEMES[next].id)
    try {
      localStorage.setItem(STORAGE_KEY, THEMES[next].id)
    } catch {
      /* modo privado o storage bloqueado: el tema igual se aplica en esta sesión */
    }

    clearTimeout(transitionTimer.current)
    transitionTimer.current = setTimeout(() => root.classList.remove("theme-transition"), 600)

    indexRef.current = next
    setIndex(next)
    setShowLabel(true)
    clearTimeout(labelTimer.current)
    labelTimer.current = setTimeout(() => setShowLabel(false), 1600)

    scheduleAutoChange()
  }

  // Cada cambio (manual o automático) reprograma el siguiente auto-cambio,
  // para que un click no quede seguido de inmediato por uno automático.
  const scheduleAutoChange = () => {
    clearInterval(autoTimer.current)
    autoTimer.current = setInterval(cycleTheme, AUTO_CHANGE_INTERVAL)
  }

  useEffect(() => {
    scheduleAutoChange()
    return () => {
      clearTimeout(labelTimer.current)
      clearTimeout(transitionTimer.current)
      clearInterval(autoTimer.current)
    }
  }, [])

  const current = THEMES[index]
  // Visible tanto al pasar el cursor/foco (para saber qué paleta hay antes de
  // cambiarla) como justo después de un cambio (manual o automático).
  const labelVisible = showLabel || isHovered

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        onClick={cycleTheme}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        aria-label={`Cambiar paleta de colores (actual: ${current.label})`}
        className="group relative flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full"
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember-400 opacity-40 motion-reduce:hidden" />
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-ember-500/60 bg-ember-500/10 text-ember-400 shadow-[0_0_14px_-2px_var(--color-glow)] transition-transform duration-200 group-hover:scale-110 group-hover:bg-ember-500/20 group-active:scale-95">
          <HiOutlineSwatch className="h-5 w-5" />
        </span>
      </button>

      {/* Confirma qué paleta hay activa: al pasar el cursor/foco antes de
          cambiarla, y justo después de un cambio manual o automático. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-full mt-2 whitespace-nowrap rounded-full border border-ember-500/40 bg-steel-900/90 px-3 py-1 text-xs font-medium text-ember-300 backdrop-blur-sm transition-all duration-200 ${
          labelVisible ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
        }`}
      >
        {current.label}
      </span>

      <span aria-live="polite" className="sr-only">
        {showLabel ? `Paleta ${current.label} aplicada` : ""}
      </span>
    </div>
  )
}
