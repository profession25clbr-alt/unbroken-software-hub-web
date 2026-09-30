import SectionHeading from "./SectionHeading"
import { FAQ } from "../content/faq"

// <details> nativo: el texto de cada respuesta está siempre en el HTML (lo leen
// los buscadores y las IAs aunque esté cerrada) y se abre sin JavaScript.
export default function Faq() {
  return (
    <section id="preguntas-frecuentes" className="py-24 md:py-32 border-t border-steel-800">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeading
          title="Preguntas frecuentes"
          description="Lo que suelen preguntar antes de empezar un proyecto."
        />

        <div className="space-y-3">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-steel-700 bg-steel-900/50 transition-colors duration-200 open:border-ember-500/40 open:bg-steel-900 hover:border-ember-500/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-display text-lg font-medium text-steel-100 [&::-webkit-details-marker]:hidden">
                <h3 className="text-lg font-medium">{item.q}</h3>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-2xl leading-none text-ember-400 transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="px-5 pb-5 text-base leading-relaxed text-steel-300">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
