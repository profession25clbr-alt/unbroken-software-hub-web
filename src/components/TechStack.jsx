const STACK = [
  "React", "Node.js", "Java / Spring Boot", "PostgreSQL", "AWS",
]

export default function TechStack() {
  return (
    <div className="py-10 border-t border-steel-800">
      <div className="mx-auto max-w-[1400px] px-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-5 text-center sm:text-left">
        <p className="text-sm text-steel-500 shrink-0">
          Elijo la tecnología según lo que necesita cada proyecto, entre otras:
        </p>
        <p className="text-sm text-steel-400">{STACK.join(" · ")}</p>
      </div>
    </div>
  )
}
