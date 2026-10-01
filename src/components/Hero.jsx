import { motion } from "framer-motion"
import { DEMO_URL } from "./Demo"

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
          className="glow-blob h-[420px] w-[680px] max-w-[90vw] rounded-full blur-[110px]"
          style={{
            "--glow-base-opacity": 0.22,
            background: "radial-gradient(circle, var(--color-glow) 0%, transparent 70%)",
          }}
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
          <br className="hidden sm:inline" />{" "}
          <span className="text-gradient-ember">forjados a tu medida.</span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          custom={2}
          variants={fadeUp}
          className="mt-6 text-xl text-steel-300 max-w-2xl mx-auto leading-relaxed"
        >
          Unbroken Software Hub es un servicio de desarrollo de software y páginas web a
          medida en Chile, sin plantillas genéricas ni funciones de más.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          custom={3}
          variants={fadeUp}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="https://wa.me/56934142633?text=Hola%2C%20quiero%20conversar%20sobre%20un%20proyecto%20con%20Unbroken%20Software%20Hub"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-ember-500 px-7 py-3.5 font-medium text-steel-950 shadow-lg shadow-ember-500/25 transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-ember-400 hover:shadow-xl hover:shadow-ember-500/40 active:translate-y-0 active:scale-[0.97]"
          >
            Cuéntame tu proyecto
          </a>
          <a
            href="#servicios"
            className="inline-flex items-center justify-center rounded-full border border-steel-600 px-7 py-3.5 font-medium text-steel-100 transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-steel-400 hover:bg-steel-800/50 active:translate-y-0 active:scale-[0.97]"
          >
            Ver servicios
          </a>
        </motion.div>

        <motion.p
          initial="hidden"
          animate="show"
          custom={4}
          variants={fadeUp}
          className="mt-6 text-base text-steel-300"
        >
          ¿Prefieres verlo funcionando?{" "}
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-ember-400 underline-offset-4 transition-colors hover:text-ember-300 hover:underline"
          >
            Prueba la app demo
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
            <span aria-hidden="true"> ↗</span>
          </a>
        </motion.p>
      </div>
    </section>
  )
}
