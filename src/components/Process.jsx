import { motion } from "framer-motion"
import SectionHeading from "./SectionHeading"

const STEPS = [
  {
    n: "01",
    title: "Descubrimiento",
    description: "Conversamos sobre tu negocio, el problema a resolver y el resultado que esperas.",
  },
  {
    n: "02",
    title: "Propuesta",
    description: "Defino alcance, tecnología y tiempos en una propuesta clara, sin letra chica.",
  },
  {
    n: "03",
    title: "Desarrollo",
    description: "Construyo en iteraciones cortas, con avances visibles y espacio para ajustar el rumbo.",
  },
  {
    n: "04",
    title: "Entrega y soporte",
    description: "Lanzamiento acompañado y disponibilidad para evolucionar el producto después.",
  },
]

export default function Process() {
  return (
    <section id="proceso" className="py-24 md:py-32 border-t border-steel-800">
      <div className="mx-auto max-w-[1400px] px-6">
        <SectionHeading
          title="Un proceso simple y transparente"
          description="Sin procesos inflados ni burocracia. El foco está en avanzar y mantenerte informado."
        />

        <div className="grid md:grid-cols-4 gap-6 md:gap-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative pl-6 md:pl-0 md:pt-6 border-l md:border-l-0 md:border-t border-steel-700"
            >
              <span className="font-display text-4xl font-semibold text-ember-500/70">
                {step.n}
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold text-steel-100">{step.title}</h3>
              <p className="mt-2 text-base text-steel-300 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
