import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Services from "./components/Services"
import Process from "./components/Process"
import TechStack from "./components/TechStack"
import About from "./components/About"
import Contact from "./components/Contact"
import Footer from "./components/Footer"

export default function App() {
  return (
    <div className="min-h-screen bg-steel-950 text-steel-100">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Process />
        <TechStack />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
