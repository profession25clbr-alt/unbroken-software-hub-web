import { motion } from "framer-motion"
import { HiCheck, HiOutlineCpuChip, HiOutlineGlobeAlt } from "react-icons/hi2"
import SectionHeading from "./SectionHeading"

const WHATSAPP_NUMBER = "56934142633"

const APP_PHASES = [
  {
    step: "Mientras se construye",
    description:
      "El pago cubre en conjunto el desarrollo personalizado, la infraestructura en la nube y la mantención del sistema, durante el tiempo de implementación definido en el plan de trabajo.",
  },
  {
    step: "Cuando el sistema está terminado y estable",
    description:
      "El costo baja: se mantiene el pago de infraestructura y respaldos, ya sin el componente de desarrollo activo incluido.",
  },
]

const WEB_ITEMS = [
  "Se parte con un plan estándar para la página",
  "Incluye hosting y mantención",
  "Las modificaciones y ajustes van incluidos en el plan, no se cobran aparte",
]

export default function Pricing() {
  const waMessage = encodeURIComponent(
    "Hola, quiero que analicemos mi proyecto para armar un plan de trabajo con Everforged Software"
  )

  return (
    <section id="planes" className="py-24 md:py-32 border-t border-steel-800">
      <div className="mx-auto max-w-[1400px] px-6">
        <SectionHeading
          eyebrow="Forma de trabajo y pago"
          title="El plan se arma según lo que tu proyecto necesita"
          description="No trabajo con tarifas fijas de catálogo: cada proyecto parte con un análisis de lo que realmente se necesita, y desde ahí se define un plan de trabajo y de pago acorde."
        />

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-steel-700 bg-steel-900/50 p-8"
          >
            <div className="h-11 w-11 rounded-xl bg-ember-500/10 text-ember-400 flex items-center justify-center">
              <HiOutlineCpuChip className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-display text-2xl font-semibold text-steel-100">
              Aplicaciones y sistemas a medida
            </h3>
            <p className="mt-2 text-base text-steel-300 leading-relaxed">
              El costo se ajusta según la etapa en la que está tu proyecto.
            </p>

            <ol className="mt-7 space-y-6 border-l border-steel-700 pl-6">
              {APP_PHASES.map((phase, i) => (
                <li key={phase.step} className="relative">
                  <span className="absolute -left-[1.85rem] top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-ember-500 text-[11px] font-semibold text-steel-950">
                    {i + 1}
                  </span>
                  <h4 className="font-medium text-steel-100 text-base">{phase.step}</h4>
                  <p className="mt-1.5 text-base text-steel-300 leading-relaxed">
                    {phase.description}
                  </p>
                </li>
              ))}
            </ol>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-steel-700 bg-steel-900/50 p-8"
          >
            <div className="h-11 w-11 rounded-xl bg-ember-500/10 text-ember-400 flex items-center justify-center">
              <HiOutlineGlobeAlt className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-display text-2xl font-semibold text-steel-100">
              Páginas web
            </h3>
            <p className="mt-2 text-base text-steel-300 leading-relaxed">
              Un modelo más simple, pensado para sitios que se actualizan con el tiempo.
            </p>

            <ul className="mt-7 space-y-4">
              {WEB_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-base text-steel-200">
                  <HiCheck className="h-5 w-5 shrink-0 text-ember-400" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-12 text-center"
        >
          <p className="text-base text-steel-400 max-w-2xl mx-auto">
            Antes de partir, se revisa qué necesita tu proyecto y se arma un plan de trabajo
            con tiempos de implementación definidos.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-ember-500 hover:bg-ember-400 text-steel-950 font-medium px-6 py-3 transition-colors"
          >
            Conversar mi proyecto por WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  )
}
