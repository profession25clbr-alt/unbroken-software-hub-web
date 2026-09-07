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
      className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center"
    >
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-steel-800 border border-steel-600 shadow-lg shadow-black/40 transition-transform hover:scale-105 hover:border-ember-500/60">
        <HiOutlineEnvelope className="h-6 w-6 text-steel-100" />
      </span>
    </a>
  )
}
