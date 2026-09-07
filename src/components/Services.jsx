import { motion } from "framer-motion"
import { HiOutlineCodeBracket, HiOutlineGlobeAlt, HiOutlineCog6Tooth, HiOutlineArrowPath } from "react-icons/hi2"
import SectionHeading from "./SectionHeading"

const SERVICES = [
  {
    icon: HiOutlineCodeBracket,
    title: "Software a medida",
    description:
      "Sistemas internos, herramientas de gestión y automatizaciones diseñadas alrededor de cómo trabaja tu equipo, no al revés.",
  },
  {
    icon: HiOutlineGlobeAlt,
    title: "Sitios y páginas web",
    description:
      "Landing pages, sitios corporativos y plataformas web rápidas, responsivas y con una experiencia de usuario cuidada al detalle.",
  },
  {
    icon: HiOutlineCog6Tooth,
    title: "Integraciones y APIs",
    description:
      "Conexión entre tus sistemas, pasarelas de pago, servicios externos y automatización de procesos manuales.",
  },
  {
    icon: HiOutlineArrowPath,
    title: "Soporte y evolución",
    description:
      "Acompañamiento post-lanzamiento: mejoras continuas, nuevas funcionalidades y mantención del producto en el tiempo.",
  },
]

export default function Services() {
  return (
    <section id="servicios" className="py-24 md:py-32 border-t border-steel-800">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Servicios"
          title="Lo que puedo construir para ti"
          description="Cada proyecto parte entendiendo el problema real del negocio, antes de escribir una sola línea de código."
        />

        <div className="grid sm:grid-cols-2 gap-6">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group rounded-2xl border border-steel-700 bg-steel-900/50 p-7 hover:border-ember-500/60 hover:bg-steel-900 transition-colors"
            >
              <div className="h-11 w-11 rounded-xl bg-ember-500/10 text-ember-400 flex items-center justify-center group-hover:bg-ember-500/15 transition-colors">
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-steel-100">
                {service.title}
              </h3>
              <p className="mt-2.5 text-sm text-steel-300 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
