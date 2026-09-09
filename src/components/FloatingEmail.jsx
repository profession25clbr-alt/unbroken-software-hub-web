import { HiOutlineEnvelope } from "react-icons/hi2"

const CONTACT_EMAIL = "profession25cl.br@gmail.com"

const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}&su=${encodeURIComponent(
  "Proyecto con Everforged Software"
)}`

export default function FloatingEmail() {
  // Botón en vez de <a href>: evita que el navegador muestre la URL de
  // destino pegada abajo a la izquierda al pasar el cursor.
  const openEmail = () => {
    window.open(GMAIL_COMPOSE_URL, "_blank", "noopener,noreferrer")
  }

  return (
    <button
      type="button"
      onClick={openEmail}
      aria-label="Escribir un correo por Gmail"
      className="group fixed bottom-6 left-6 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full"
    >
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-steel-600 bg-steel-800 shadow-lg shadow-black/40 transition-all duration-200 group-hover:scale-110 group-hover:border-ember-500/60 group-active:scale-95">
        <HiOutlineEnvelope className="h-6 w-6 text-steel-100" />
      </span>
    </button>
  )
}
