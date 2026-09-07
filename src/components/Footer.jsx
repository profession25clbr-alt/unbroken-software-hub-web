import { FaWhatsapp } from "react-icons/fa"
import { HiOutlineEnvelope } from "react-icons/hi2"
import Logo from "./Logo"

const WHATSAPP_NUMBER = "56934142633"
const CONTACT_EMAIL = "profession25cl.br@gmail.com"

const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hola, quiero conversar sobre un proyecto con Everforged Software"
)}`
const GMAIL_HREF = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}&su=${encodeURIComponent(
  "Proyecto con Everforged Software"
)}`

const LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#automatizacion", label: "Automatización" },
  { href: "#planes", label: "Planes" },
  { href: "#proceso", label: "Proceso" },
  { href: "#sobre-mi", label: "Sobre mí" },
]

export default function Footer() {
  return (
    <footer className="border-t border-steel-800 py-14">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-base text-steel-400 leading-relaxed">
              Aplicaciones a medida, páginas web y automatización de procesos para
              negocios que necesitan una solución hecha a su forma de trabajar.
            </p>
          </div>

          <nav aria-label="Secciones del sitio">
            <h2 className="text-sm font-medium uppercase tracking-widest text-steel-300">
              Secciones
            </h2>
            <ul className="mt-4 space-y-2.5">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-base text-steel-400 transition-colors hover:text-ember-400"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-medium uppercase tracking-widest text-steel-300">
              Conversemos
            </h2>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-base text-steel-400 transition-colors hover:text-ember-400"
                >
                  <FaWhatsapp className="h-5 w-5 shrink-0" />
                  +56 9 3414 2633
                </a>
              </li>
              <li>
                <a
                  href={GMAIL_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-base text-steel-400 transition-colors hover:text-ember-400 break-all"
                >
                  <HiOutlineEnvelope className="h-5 w-5 shrink-0" />
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-steel-800 pt-6 text-sm text-steel-500">
          © {new Date().getFullYear()} Everforged Software. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
