import { useEffect, useState } from "react"
import Logo from "./Logo"

const LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#proceso", label: "Proceso" },
  { href: "#stack", label: "Tecnologías" },
  { href: "#contacto", label: "Contacto" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-steel-950/85 backdrop-blur-md border-b border-steel-700/60" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <a href="#top" aria-label="Everforged Software - inicio">
          <Logo />
        </a>

        <ul className="hidden md:flex items-center gap-8 text-sm text-steel-300">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="hover:text-steel-100 transition-colors">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contacto"
          className="hidden md:inline-flex items-center rounded-full bg-ember-500 hover:bg-ember-400 text-steel-950 font-medium text-sm px-4 py-2 transition-colors"
        >
          Hablemos
        </a>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
          aria-expanded={open}
          className="md:hidden text-steel-100 p-2 -mr-2"
        >
          <span className="sr-only">Menú</span>
          <div className="w-6 flex flex-col gap-1.5">
            <span
              className={`h-0.5 bg-current transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span className={`h-0.5 bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
            <span
              className={`h-0.5 bg-current transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </div>
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-steel-950/95 backdrop-blur-md border-b border-steel-700/60 px-6 pb-6 pt-2">
          <ul className="flex flex-col gap-4 text-steel-300">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-1 hover:text-steel-100"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contacto"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex items-center rounded-full bg-ember-500 text-steel-950 font-medium text-sm px-4 py-2"
          >
            Hablemos
          </a>
        </div>
      )}
    </header>
  )
}
