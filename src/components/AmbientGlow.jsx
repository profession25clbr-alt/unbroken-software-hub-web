const BLOBS = [
  { top: "22%", left: "15%", size: 520, opacity: 0.24 },
  { top: "40%", left: "85%", size: 480, opacity: 0.22 },
  { top: "58%", left: "12%", size: 520, opacity: 0.22 },
  { top: "76%", left: "88%", size: 480, opacity: 0.2 },
  { top: "94%", left: "18%", size: 500, opacity: 0.2 },
]

export default function AmbientGlow() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {BLOBS.map((blob, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-[110px]"
          style={{
            top: blob.top,
            left: blob.left,
            height: blob.size,
            width: blob.size,
            opacity: blob.opacity,
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, var(--color-glow) 0%, transparent 70%)",
          }}
        />
      ))}
    </div>
  )
}
