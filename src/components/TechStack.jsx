const STACK = [
  "React",
  "Node.js",
  "Java / Spring Boot",
  "PostgreSQL",
  "AWS",
  "Python",
  "FastAPI",
  "Gemini API",
  "MySQL",
  "MongoDB",
  "Firebase",
  "TypeScript",
  "Docker",
  "Linux",
  "Git",
  "Nginx",
  "Express",
  "Vite",
  "GraphQL",
  "Redis",
  "Next.js",
  "Kubernetes",
  "CI/CD (GitHub Actions)",
]

export default function TechStack() {
  const items = STACK.join(" · ")

  return (
    <div className="py-10 border-t border-steel-800">
      <div className="mx-auto max-w-[1400px] px-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-5 text-center sm:text-left">
        <p className="text-sm text-steel-500 shrink-0">
          Elijo la tecnología según lo que necesita cada proyecto, entre otras:
        </p>
        {/* Máscara en los bordes + dos copias del texto para que la cinta
            se vea continua al desplazarse (translateX(-50%) = un ancho). */}
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max animate-[tech-marquee_28s_linear_infinite] motion-reduce:animate-none">
            <p className="text-sm text-steel-400 whitespace-nowrap pr-10">{items}</p>
            <p className="text-sm text-steel-400 whitespace-nowrap pr-10" aria-hidden="true">
              {items}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
