import { motion } from "framer-motion"
import {
  HiOutlineShoppingBag,
  HiOutlineBuildingStorefront,
  HiOutlineArrowTopRightOnSquare,
} from "react-icons/hi2"
import SectionHeading from "./SectionHeading"

// Demo pública de un sistema a medida (variante monolito de "omnicanal-demo").
// Los enlaces abren en una pestaña nueva para que el visitante no pierda esta página.
export const DEMO_URL = "https://omnicanal-demo.unbrokensoftwarehub.cl/"
export const DEMO_GESTION_URL = "https://omnicanal-demo.unbrokensoftwarehub.cl/gestion/"

const APPS = [
  {
    icon: HiOutlineShoppingBag,
    title: "Tienda online",
    description:
      "Tres tiendas distintas (tecnología, moda y alimentos) con catálogo, carrito, pago simulado y seguimiento de pedidos. Prueba comprar como cliente.",
    cta: "Abrir la tienda",
    href: DEMO_URL,
  },
  {
    icon: HiOutlineBuildingStorefront,
    title: "App de gestión para tiendas físicas",
    description:
      "Caja, inventario, proveedores, órdenes de compra, pedidos online y reportes, con permisos por rol. Entra con una cuenta de prueba desde el login.",
    cta: "Abrir la app de gestión",
    href: DEMO_GESTION_URL,
  },
]

export default function Demo() {
  return (
    <section id="demo" className="py-24 md:py-32 border-t border-steel-800">
      <div className="mx-auto max-w-[1400px] px-6">
        <SectionHeading
          title="Pruébalo tú mismo: una demo en vivo"
          description="Así se ve un sistema a medida funcionando: una tienda online conectada a una app de gestión para el negocio. Se abre en una pestaña nueva."
        />

        <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
          {APPS.map((app, i) => (
            <motion.a
              key={app.title}
              href={app.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group flex flex-col rounded-2xl border border-steel-700 bg-steel-900/50 p-8 lg:p-10 transition-[transform,box-shadow,border-color,background-color] duration-200 hover:-translate-y-1 hover:border-ember-500/60 hover:bg-steel-900 hover:shadow-xl hover:shadow-black/20 focus-visible:-translate-y-1 focus-visible:border-ember-500/60"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ember-500/10 text-ember-400 transition-all duration-200 group-hover:scale-110 group-hover:bg-ember-500/20">
                <app.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-display text-2xl font-semibold text-steel-100">
                {app.title}
              </h3>
              <p className="mt-3 flex-1 text-base text-steel-300 leading-relaxed">
                {app.description}
              </p>
              <span className="mt-8 inline-flex items-center gap-2 font-medium text-ember-400 transition-colors group-hover:text-ember-300">
                {app.cta}
                <HiOutlineArrowTopRightOnSquare className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                <span className="sr-only">(se abre en una pestaña nueva)</span>
              </span>
            </motion.a>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-steel-300">
          Es una demo con datos ficticios: por favor no ingreses información personal real.
        </p>
      </div>
    </section>
  )
}
