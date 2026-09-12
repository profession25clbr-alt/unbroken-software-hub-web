import { FaWhatsapp } from "react-icons/fa"

const WHATSAPP_NUMBER = "56934142633"

export default function FloatingWhatsApp() {
  const message = encodeURIComponent(
    "Hola, quiero conversar sobre un proyecto con Unbroken Software Hub"
  )

  // Botón en vez de <a href>: evita que el navegador muestre la URL de
  // destino pegada abajo a la izquierda al pasar el cursor.
  const openWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank", "noopener,noreferrer")
  }

  return (
    <button
      type="button"
      onClick={openWhatsApp}
      aria-label="Escribir por WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-60 motion-reduce:hidden" />
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-black/40 transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
        <FaWhatsapp className="h-7 w-7 text-white" />
      </span>
    </button>
  )
}
