import { HiOutlineEnvelope } from "react-icons/hi2"

const CONTACT_EMAIL = "profession25cl.br@gmail.com"

const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}&su=${encodeURIComponent(
  "Proyecto con Everforged Software"
)}`

export default function FloatingEmail() {
  return (
    <a
      href={GMAIL_COMPOSE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir un correo por Gmail"
      className="group fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full"
    >
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-steel-600 bg-steel-800 shadow-lg shadow-black/40 transition-all duration-200 group-hover:scale-110 group-hover:border-ember-500/60 group-active:scale-95">
        <HiOutlineEnvelope className="h-6 w-6 text-steel-100" />
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-16 hidden whitespace-nowrap rounded-full bg-steel-900/95 px-3 py-1.5 text-sm text-steel-100 opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 sm:block"
      >
        Mándame un correo
      </span>
    </a>
  )
}
