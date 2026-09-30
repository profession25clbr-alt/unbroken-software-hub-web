// Símbolo: una "U" de trazo continuo (unbroken) con un nodo en el extremo.
// Es el mismo dibujo de public/favicon.svg, pero con los colores del tema activo.
export default function Logo({ className = "" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="logo-grad" x1="8" y1="6" x2="24" y2="27" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--color-ember-300)" />
            <stop offset="1" stopColor="var(--color-ember-600)" />
          </linearGradient>
        </defs>
        <path
          d="M9.5 8.5V16.5a6.5 6.5 0 0 0 13 0V11"
          stroke="url(#logo-grad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="22.5" cy="7" r="2.6" fill="var(--color-gold-400)" />
      </svg>
      <span className="font-display font-semibold text-xl tracking-tight text-steel-100">
        Unbroken Software Hub<span className="text-ember-400">.</span>
      </span>
    </div>
  )
}
