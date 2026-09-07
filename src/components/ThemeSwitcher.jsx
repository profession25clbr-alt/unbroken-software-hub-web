import { useEffect, useState } from "react"
import { HiOutlineSwatch } from "react-icons/hi2"

const THEMES = [
  "forge",
  "forge-light",
  "volt",
  "volt-light",
  "toxic",
  "toxic-light",
  "royal",
  "royal-light",
]
const STORAGE_KEY = "everforged-theme"

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("forge")

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && THEMES.includes(saved)) {
      setTheme(saved)
      document.documentElement.setAttribute("data-theme", saved)
    }
  }, [])

  const cycleTheme = () => {
    const next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length]
    setTheme(next)
    document.documentElement.setAttribute("data-theme", next)
    localStorage.setItem(STORAGE_KEY, next)
  }

  return (
    <button
      onClick={cycleTheme}
      aria-label="Cambiar paleta de colores"
      title="Cambiar paleta de colores"
      className="relative flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember-400 opacity-40" />
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-ember-500/60 bg-ember-500/10 text-ember-400 transition-colors hover:bg-ember-500/20">
        <HiOutlineSwatch className="h-5 w-5" />
      </span>
    </button>
  )
}
