import { motion } from "framer-motion"
import {
  HiOutlineQueueList,
  HiOutlineClock,
  HiOutlineChatBubbleLeftRight,
  HiOutlineAdjustmentsHorizontal,
} from "react-icons/hi2"
import SectionHeading from "./SectionHeading"

const FEATURED = {
  icon: HiOutlineChatBubbleLeftRight,
  title: "Mensajes automáticos por WhatsApp",
  description:
    "Respuestas o avisos predeterminados que se disparan solos ante ciertas acciones, para que la comunicación con tus clientes no dependa de que alguien esté disponible en ese momento.",
}

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
          title="Algunos ejemplos de lo que se puede automatizar"
          description="Son solo ejemplos. Si en tu negocio hay algo manual y repetitivo, probablemente se puede automatizar."
        />

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="group rounded-2xl border border-steel-700 bg-steel-900/50 p-8 lg:p-10 transition-[transform,box-shadow,border-color,background-color] duration-200 hover:-translate-y-1 hover:border-ember-500/60 hover:bg-steel-900 hover:shadow-xl hover:shadow-black/20"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ember-500/10 text-ember-400 transition-all duration-200 group-hover:scale-110 group-hover:bg-ember-500/20">
              <FEATURED.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-6 font-display text-2xl font-semibold text-steel-100">
              {FEATURED.title}
            </h3>
            <p className="mt-3 text-base text-steel-300 leading-relaxed max-w-md">
              {FEATURED.description}
            </p>
          </motion.div>

          <div className="divide-y divide-steel-800 lg:self-center">
            {EXAMPLES.map((example, i) => (
              <motion.div
                key={example.title}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-4 py-5 first:pt-0 last:pb-0"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ember-500/10 text-ember-400">
                  <example.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display text-base font-semibold text-steel-100">
                    {example.title}
                  </h4>
                  <p className="mt-1 text-sm text-steel-300 leading-relaxed">
                    {example.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
