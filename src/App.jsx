import { MotionConfig } from "framer-motion"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Services from "./components/Services"
import Automation from "./components/Automation"
import Pricing from "./components/Pricing"
import Process from "./components/Process"
import Faq from "./components/Faq"
import About from "./components/About"
import TechStack from "./components/TechStack"
import Footer from "./components/Footer"
import FloatingWhatsApp from "./components/FloatingWhatsApp"
import FloatingEmail from "./components/FloatingEmail"
import ChatWidget from "./components/ChatWidget"
import AmbientGlow from "./components/AmbientGlow"

export default function App() {
  return (
    // reducedMotion="user" desactiva los desplazamientos de framer-motion
    // para quien tenga "reducir movimiento" activado en su sistema.
    <MotionConfig reducedMotion="user">
      <div className="relative z-0 min-h-screen bg-steel-950 text-steel-100">
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <AmbientGlow />
        <Navbar />
        <main id="contenido">
          <Hero />
          <Services />
          <Automation />
          <Pricing />
          <Process />
          <About />
          <TechStack />
          <Faq />
        </main>
        <Footer />
        <FloatingWhatsApp />
        <FloatingEmail />
        <ChatWidget />
      </div>
    </MotionConfig>
  )
}
