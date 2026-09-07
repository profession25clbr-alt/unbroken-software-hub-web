import { motion } from "framer-motion"
import SectionHeading from "./SectionHeading"

const STACK = [
  "React", "Node.js", "Java / Spring Boot", "TypeScript",
  "PostgreSQL", "Docker", "AWS", "Tailwind CSS",
  "Python", "REST / APIs", "WordPress", "n8n",
]

export default function TechStack() {
  return (
    <section id="stack" className="py-24 md:py-32 border-t border-steel-800">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Tecnologías"
          title="Herramientas con las que trabajo"
          description="Elijo la tecnología según lo que el proyecto necesita, no al revés."
        />

        <div className="flex flex-wrap justify-center gap-3">
          {STACK.map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="rounded-full border border-steel-700 bg-steel-900/50 px-4 py-2 text-sm text-steel-200 hover:border-ember-500/60 hover:text-steel-100 transition-colors"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  )
}
