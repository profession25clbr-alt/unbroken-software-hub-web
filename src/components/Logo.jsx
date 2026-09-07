export default function Logo({ className = "" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14 2 L24 8 V20 L14 26 L4 20 V8 Z"
          stroke="url(#logo-grad)"
          strokeWidth="2"
          fill="none"
        />
        <path d="M14 9 L18.5 14 L14 19 L9.5 14 Z" fill="url(#logo-grad)" />
        <defs>
          <linearGradient id="logo-grad" x1="4" y1="2" x2="24" y2="26" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ff9857" />
            <stop offset="1" stopColor="#d63a12" />
          </linearGradient>
        </defs>
      </svg>
      <span className="font-display font-semibold text-xl tracking-tight text-steel-100">
        Everforged<span className="text-ember-400">.</span>
      </span>
    </div>
  )
}
