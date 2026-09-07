import { motion } from "framer-motion"

const HIGHLIGHTS = [
  "Sistemas de gestión y ERPs a medida en producción",
  "Automatización e integración con WhatsApp y APIs externas",
  "Backends robustos en Java/Spring Boot y Node.js",
  "Frontends modernos, rápidos y cuidados en React",
]

export default function About() {
  return (
    <section id="sobre-mi" className="py-24 md:py-32 border-t border-steel-800">
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-xs font-medium tracking-widest uppercase text-ember-400">
            Sobre Everforged
          </span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold tracking-tight text-steel-100">
            Un desarrollador, no una fábrica de plantillas
          </h2>
          <p className="mt-5 text-steel-300 leading-relaxed">
            Everforged Software es el estudio de desarrollo enfocado en construir productos
            digitales reales para negocios reales: sistemas internos que se usan todos los días,
            integraciones que ahorran horas de trabajo manual y sitios web que efectivamente
            convierten visitas en clientes.
          </p>
          <p className="mt-4 text-steel-300 leading-relaxed">
            Cada línea de código se piensa para durar en producción, no solo para la demo.
          </p>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4"
        >
          {HIGHLIGHTS.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-xl border border-steel-700 bg-steel-900/50 px-5 py-4 text-sm text-steel-200"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ember-400" />
              {item}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
