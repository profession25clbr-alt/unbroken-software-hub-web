import { FaWhatsapp } from "react-icons/fa"
import { HiOutlineEnvelope } from "react-icons/hi2"
import Logo from "./Logo"

const WHATSAPP_NUMBER = "56934142633"
const CONTACT_EMAIL = "profession25cl.br@gmail.com"

const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hola, quiero conversar sobre un proyecto con Unbroken Software Hub"
)}`
const GMAIL_HREF = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}&su=${encodeURIComponent(
  "Proyecto con Unbroken Software Hub"
)}`

// Botones en vez de <a href>: no muestran la URL de destino al pasar el cursor.
const openExternal = (url) => window.open(url, "_blank", "noopener,noreferrer")

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
            {/* Solo íconos: el número y el correo no se muestran en pantalla. */}
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => openExternal(WHATSAPP_HREF)}
                aria-label="Escribir por WhatsApp"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-steel-700 bg-steel-900/50 text-steel-300 transition-[transform,color,border-color] duration-200 hover:-translate-y-0.5 hover:border-ember-500/60 hover:text-ember-400 active:scale-95"
              >
                <FaWhatsapp className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => openExternal(GMAIL_HREF)}
                aria-label="Escribir un correo por Gmail"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-steel-700 bg-steel-900/50 text-steel-300 transition-[transform,color,border-color] duration-200 hover:-translate-y-0.5 hover:border-ember-500/60 hover:text-ember-400 active:scale-95"
              >
                <HiOutlineEnvelope className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <p className="mt-12 border-t border-steel-800 pt-6 text-sm text-steel-500">
          © {new Date().getFullYear()} Unbroken Software Hub. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
