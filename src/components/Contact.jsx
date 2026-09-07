import { motion } from "framer-motion"
import { HiOutlineEnvelope } from "react-icons/hi2"

const CONTACT_EMAIL = "profession25cl.br@gmail.com"

export default function Contact() {
  return (
    <section id="contacto" className="py-24 md:py-32 border-t border-steel-800">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-xs font-medium tracking-widest uppercase text-ember-400">
            Contacto
          </span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold tracking-tight text-steel-100">
            ¿Tienes un proyecto en mente?
          </h2>
          <p className="mt-4 text-steel-300 leading-relaxed max-w-xl mx-auto">
            Cuéntame qué necesitas y conversemos si Everforged Software es el equipo
            indicado para construirlo contigo.
          </p>

          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Proyecto%20con%20Everforged%20Software`}
            className="mt-9 inline-flex items-center gap-2.5 rounded-full bg-ember-500 hover:bg-ember-400 text-steel-950 font-medium px-7 py-3.5 transition-colors"
          >
            <HiOutlineEnvelope className="h-5 w-5" />
            {CONTACT_EMAIL}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
