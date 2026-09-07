import { useEffect, useRef, useState } from "react"
import { HiOutlineChatBubbleLeftRight, HiOutlineMinus, HiOutlinePaperAirplane } from "react-icons/hi2"

const CHAT_ENDPOINT = import.meta.env.VITE_CHAT_API_URL || "http://localhost:8787/api/chat"

const WELCOME = {
  role: "model",
  text: "¡Hola! Soy el asistente de Everforged Software. Pregúntame sobre servicios, automatización, forma de trabajo o cómo contactar.",
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)
  const openRef = useRef(open)

  useEffect(() => {
    openRef.current = open
  }, [open])

  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, open])

  const sendMessage = async (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    const nextMessages = [...messages, { role: "user", text }]
    setMessages(nextMessages)
    setInput("")
    setLoading(true)

    try {
      const response = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: nextMessages.slice(0, -1),
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Error desconocido")

      setMessages((prev) => [...prev, { role: "model", text: data.reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "No pude responder en este momento. Escríbeme directo por WhatsApp o correo, están en el pie de página.",
        },
      ])
    } finally {
      setLoading(false)
      // Si minimizaron el chat mientras esperaba la respuesta, se reabre solo
      // para que no se pierdan la respuesta.
      if (!openRef.current) setOpen(true)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir chat"
        aria-expanded={open}
        aria-controls="chat-panel"
        tabIndex={open ? -1 : 0}
        className={`fixed bottom-24 right-6 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-ember-500 shadow-lg shadow-black/40 transition-all duration-200 hover:scale-110 active:scale-95 ${
          open ? "pointer-events-none scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <HiOutlineChatBubbleLeftRight className="h-6 w-6 text-steel-950" />
      </button>

      <div
        id="chat-panel"
        role="dialog"
        aria-label="Chat con el asistente de Everforged Software"
        className={`fixed bottom-[6.5rem] right-6 z-50 flex w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-steel-700 bg-steel-900/95 shadow-2xl shadow-black/50 backdrop-blur-md transition-all duration-200 ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
        style={{ height: "min(28rem, 70vh)" }}
      >
        <div className="flex items-start justify-between gap-2 border-b border-steel-700 px-4 py-3">
          <div>
            <p className="font-display text-sm font-semibold text-steel-100">Asistente Everforged</p>
            <p className="text-xs text-steel-400">Responde según los servicios del sitio</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Minimizar chat"
            className="shrink-0 cursor-pointer rounded-full p-1 text-steel-400 transition-colors hover:bg-steel-800 hover:text-steel-100"
          >
            <HiOutlineMinus className="h-5 w-5" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "ml-auto bg-ember-500 text-steel-950"
                  : "bg-steel-800 text-steel-100"
              }`}
            >
              {m.text}
            </div>
          ))}
          {loading && (
            <div className="max-w-[85%] rounded-2xl bg-steel-800 px-3.5 py-2.5 text-sm text-steel-400">
              Escribiendo…
            </div>
          )}
        </div>

        <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-steel-700 p-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta…"
            maxLength={800}
            disabled={loading}
            className="flex-1 rounded-full border border-steel-600 bg-steel-950/60 px-4 py-2 text-sm text-steel-100 placeholder:text-steel-500 focus:border-ember-500/60"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Enviar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ember-500 text-steel-950 transition-transform disabled:opacity-40 enabled:hover:scale-105 enabled:active:scale-95"
          >
            <HiOutlinePaperAirplane className="h-4 w-4" />
          </button>
        </form>
      </div>
    </>
  )
}
