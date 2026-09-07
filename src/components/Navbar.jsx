import { useEffect, useState } from "react"
import Logo from "./Logo"
import ThemeSwitcher from "./ThemeSwitcher"

const LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#automatizacion", label: "Automatización" },
  { href: "#planes", label: "Planes" },
  { href: "#proceso", label: "Proceso" },
  { href: "#sobre-mi", label: "Sobre mí" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState("")

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Marca en qué sección va el usuario mientras scrollea.
  useEffect(() => {
    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(Boolean)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setActive(`#${visible.target.id}`)
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  // Cierra el menú móvil con Escape o al pasar a desktop.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === "Escape" && setOpen(false)
    const onResize = () => window.innerWidth >= 768 && setOpen(false)
    window.addEventListener("keydown", onKey)
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("resize", onResize)
    }
  }, [open])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "bg-steel-950/85 backdrop-blur-md border-b border-steel-700/60"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Navegación principal"
        className="mx-auto max-w-[1400px] px-6 h-16 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <a href="#top" aria-label="Everforged Software - inicio" className="rounded-lg">
            <Logo />
          </a>
        </div>

        <ul className="hidden md:flex items-center gap-8 text-base text-steel-300">
          {LINKS.map((link) => {
            const isActive = active === link.href
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative py-1 transition-colors hover:text-steel-100 ${
                    isActive ? "text-steel-100" : ""
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-0.5 rounded-full bg-ember-400 transition-all duration-300 ${
                      isActive ? "w-full opacity-100" : "w-0 opacity-0"
                    }`}
                  />
                </a>
              </li>
            )
          })}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="menu-movil"
          className="md:hidden cursor-pointer text-steel-100 p-2 -mr-2 rounded-lg"
        >
          <span className="sr-only">Menú</span>
          <div className="w-6 flex flex-col gap-1.5">
            <span
              className={`h-0.5 bg-current transition-transform duration-200 ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 bg-current transition-opacity duration-200 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-0.5 bg-current transition-transform duration-200 ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      <div
        id="menu-movil"
        className={`md:hidden overflow-hidden border-steel-700/60 bg-steel-950/95 backdrop-blur-md transition-[max-height,opacity] duration-300 ease-out ${
          open ? "max-h-96 opacity-100 border-b" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-1 px-6 pb-6 pt-2 text-steel-300">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={active === link.href ? "true" : undefined}
                className={`block rounded-lg px-2 py-2.5 transition-colors hover:bg-steel-800/60 hover:text-steel-100 ${
                  active === link.href ? "text-ember-400" : ""
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
