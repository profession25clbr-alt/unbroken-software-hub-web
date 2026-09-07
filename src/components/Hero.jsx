import { motion } from "framer-motion"

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-40 pb-28 md:pt-48 md:pb-36">
      <div className="absolute inset-0 bg-noise opacity-40" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="h-[420px] w-[680px] max-w-[90vw] rounded-full blur-[110px] opacity-[0.22]"
          style={{ background: "radial-gradient(circle, #ff4d1f 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial="hidden"
          animate="show"
          custom={0}
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-steel-700 bg-steel-900/60 px-4 py-1.5 text-sm text-steel-300 mb-8"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-ember-400 animate-pulse" />
          Disponible para nuevos proyectos
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          custom={1}
          variants={fadeUp}
          className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.08] text-steel-100"
        >
          Software y sitios web,
          <br />
          <span className="text-gradient-ember">forjados a tu medida.</span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          custom={2}
          variants={fadeUp}
          className="mt-6 text-xl text-steel-300 max-w-2xl mx-auto leading-relaxed"
        >
          Everforged Software diseña y desarrolla aplicaciones personalizadas y páginas
          web para negocios que necesitan una solución que calce exactamente con su
          operación — sin plantillas genéricas, sin funcionalidades de más.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          custom={3}
          variants={fadeUp}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="https://wa.me/56934142633?text=Hola%2C%20quiero%20conversar%20sobre%20un%20proyecto%20con%20Everforged%20Software"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-ember-500 hover:bg-ember-400 text-steel-950 font-medium px-6 py-3 transition-colors"
          >
            Cuéntame tu proyecto
          </a>
          <a
            href="#servicios"
            className="inline-flex items-center justify-center rounded-full border border-steel-600 hover:border-steel-400 text-steel-100 font-medium px-6 py-3 transition-colors"
          >
            Ver servicios
          </a>
        </motion.div>
      </div>
    </section>
  )
}
