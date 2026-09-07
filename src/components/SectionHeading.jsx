import { motion } from "framer-motion"

export default function SectionHeading({ eyebrow, title, description, align = "center" }) {
  const isCenter = align === "center"
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`max-w-2xl ${isCenter ? "mx-auto text-center" : ""} mb-14`}
    >
      {eyebrow && (
        <span className="text-xs font-medium tracking-widest uppercase text-ember-400">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold tracking-tight text-steel-100">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-steel-300 leading-relaxed">{description}</p>
      )}
    </motion.div>
  )
}
