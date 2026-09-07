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
      className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-60 motion-reduce:hidden" />
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-black/40 transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
        <FaWhatsapp className="h-7 w-7 text-white" />
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-full bg-steel-900/95 px-3 py-1.5 text-sm text-steel-100 opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 sm:block"
      >
        Escríbeme por WhatsApp
      </span>
    </a>
  )
}
