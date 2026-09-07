import { FaWhatsapp } from "react-icons/fa"

const WHATSAPP_NUMBER = "56934142633"

export default function FloatingWhatsApp() {
  const message = encodeURIComponent(
    "Hola, quiero conversar sobre un proyecto con Everforged Software"
  )

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center"
    >
      <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-60 animate-ping" />
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-black/40 transition-transform hover:scale-105">
        <FaWhatsapp className="h-7 w-7 text-white" />
      </span>
    </a>
  )
}
