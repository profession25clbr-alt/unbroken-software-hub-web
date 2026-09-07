import { motion } from "framer-motion"
import { HiOutlineCodeBracket, HiOutlineGlobeAlt, HiOutlineArrowPath, HiOutlineSparkles } from "react-icons/hi2"
import SectionHeading from "./SectionHeading"

const SERVICES = [
  {
    icon: HiOutlineCodeBracket,
    title: "Sistemas a medida",
    description:
      "Herramientas para gestionar tu negocio del día a día: pedidos, inventario, clientes, procesos internos. Se construyen alrededor de cómo trabajas tú, no de un molde genérico.",
  },
  {
    icon: HiOutlineGlobeAlt,
    title: "Sitios y páginas web",
    description:
      "Sitios corporativos, landing pages y tiendas online rápidas y fáciles de usar, pensadas para que quien te visite entienda tu servicio y te contacte.",
  },
  {
    icon: HiOutlineArrowPath,
    title: "Automatización de procesos",
    description:
      "Conecto tus sistemas entre sí y con herramientas como WhatsApp, correo o planillas, para que tareas repetitivas dejen de hacerse a mano.",
  },
  {
    icon: HiOutlineSparkles,
    title: "Inteligencia artificial aplicada",
    description:
      "Si tu negocio se beneficia de responder consultas automáticamente, clasificar información o generar contenido, evaluamos juntos qué tan grande es la necesidad y el costo real de resolverla.",
  },
]

export default function Services() {
  return (
    <section id="servicios" className="py-24 md:py-32 border-t border-steel-800">
      <div className="mx-auto max-w-[1400px] px-6">
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
              <h3 className="mt-5 font-display text-xl font-semibold text-steel-100">
                {service.title}
              </h3>
              <p className="mt-2.5 text-base text-steel-300 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
