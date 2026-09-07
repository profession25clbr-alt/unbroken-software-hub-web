import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Services from "./components/Services"
import Automation from "./components/Automation"
import Pricing from "./components/Pricing"
import Process from "./components/Process"
import About from "./components/About"
import TechStack from "./components/TechStack"
import Footer from "./components/Footer"
import FloatingWhatsApp from "./components/FloatingWhatsApp"
import FloatingEmail from "./components/FloatingEmail"
import AmbientGlow from "./components/AmbientGlow"

export default function App() {
  return (
    <div className="relative z-0 min-h-screen bg-steel-950 text-steel-100">
      <AmbientGlow />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Automation />
        <Pricing />
        <Process />
        <About />
        <TechStack />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <FloatingEmail />
    </div>
  )
}
