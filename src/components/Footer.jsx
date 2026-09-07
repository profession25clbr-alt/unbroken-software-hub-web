import Logo from "./Logo"

export default function Footer() {
  return (
    <footer className="border-t border-steel-800 py-10">
      <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Logo />
        <p className="text-sm text-steel-400">
          © {new Date().getFullYear()} Everforged Software. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
