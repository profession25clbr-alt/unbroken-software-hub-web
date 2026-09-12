import { motion } from "framer-motion"

const HIGHLIGHTS = [
  "Sistemas de gestión en uso real, todos los días, dentro de negocios activos",
  "Automatización de tareas que hoy se hacen a mano o por WhatsApp",
  "Plataformas capaces de soportar el crecimiento del negocio, no solo el lanzamiento",
  "Interfaces simples de usar, sin curva de aprendizaje para tu equipo",
]

export default function About() {
  return (
    <section id="sobre-mi" className="py-24 md:py-32 border-t border-steel-800">
      <div className="mx-auto max-w-[1400px] px-6 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <div className="flex items-center gap-5 mb-6">
            <div className="h-24 w-24 shrink-0 rounded-full p-[2px] bg-gradient-to-br from-ember-400 to-gold-400">
              <img
                src="/images/founder.jpg"
                alt="Fundador de Unbroken Software Hub"
                width="240"
                height="240"
                loading="lazy"
                decoding="async"
                className="h-full w-full rounded-full object-cover border-2 border-steel-950"
              />
            </div>
            <div>
              <p className="text-base text-steel-300">Fundador de Unbroken Software Hub</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-steel-100">
              Un desarrollador, no una fábrica de plantillas
            </h2>
            <p className="mt-5 text-lg text-steel-300 leading-relaxed">
              Unbroken Software Hub construye herramientas y sitios web para negocios que
              necesitan algo específico: un proceso que hoy se hace a mano, un sistema que
              ya no da abasto, o simplemente una presencia web que refleje bien lo que hacen.
            </p>
            <p className="mt-4 text-lg text-steel-300 leading-relaxed">
              Si tienes una idea clara de lo que necesitas, la conversamos y evaluamos en
              conjunto cómo construirla de forma realista, con plazos y alcance definidos
              desde el principio.
            </p>
          </motion.div>
        </div>

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
              className="flex items-start gap-3 rounded-xl border border-steel-700 bg-steel-900/50 px-5 py-4 text-base text-steel-200 transition-colors duration-200 hover:border-ember-500/40 hover:bg-steel-900"
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
