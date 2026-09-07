import { motion } from "framer-motion"
import {
  HiOutlineQueueList,
  HiOutlineClock,
  HiOutlineChatBubbleLeftRight,
  HiOutlineAdjustmentsHorizontal,
} from "react-icons/hi2"
import SectionHeading from "./SectionHeading"

const EXAMPLES = [
  {
    icon: HiOutlineQueueList,
    title: "Gestión de múltiples procesos",
    description:
      "Coordinar varias tareas y flujos de trabajo que dependen entre sí, para que nada quede pendiente o se pierda en el camino.",
  },
  {
    icon: HiOutlineClock,
    title: "Correos programados",
    description:
      "Recordatorios, reportes o avisos que se envían solos, en la fecha y hora que definas, sin que alguien tenga que hacerlo a mano.",
  },
  {
    icon: HiOutlineChatBubbleLeftRight,
    title: "Mensajes automáticos por WhatsApp",
    description:
      "Respuestas o avisos predeterminados que se disparan solos ante ciertas acciones, para que la comunicación con tus clientes no dependa de que alguien esté disponible en ese momento.",
  },
  {
    icon: HiOutlineAdjustmentsHorizontal,
    title: "Procesos particulares de tu negocio",
    description:
      "Si tienes una tarea específica y repetitiva que nadie más resuelve por ti, se analiza cómo automatizarla puntualmente.",
  },
]

export default function Automation() {
  return (
    <section id="automatizacion" className="py-24 md:py-32 border-t border-steel-800">
      <div className="mx-auto max-w-[1400px] px-6">
        <SectionHeading
          eyebrow="Automatización"
          title="Algunos ejemplos de lo que se puede automatizar"
          description="Son solo ejemplos — si en tu negocio hay algo manual y repetitivo, probablemente se puede automatizar."
        />

        <div className="grid sm:grid-cols-2 gap-6">
          {EXAMPLES.map((example, i) => (
            <motion.div
              key={example.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group rounded-2xl border border-steel-700 bg-steel-900/50 p-7 hover:border-ember-500/60 hover:bg-steel-900 transition-colors"
            >
              <div className="h-11 w-11 rounded-xl bg-ember-500/10 text-ember-400 flex items-center justify-center group-hover:bg-ember-500/15 transition-colors">
                <example.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-steel-100">
                {example.title}
              </h3>
              <p className="mt-2.5 text-base text-steel-300 leading-relaxed">
                {example.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
