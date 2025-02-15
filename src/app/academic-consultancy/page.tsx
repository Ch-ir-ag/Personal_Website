"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FiArrowLeft } from 'react-icons/fi'
import { useEffect, useRef } from "react"

const services = [
  {
    title: "Academic Consultation",
    price: "€45/hour",
    description: "One-on-one consultation for academics.",
    features: [
      "STEM student guidance (Mechatronics, AI, Software Engineering)",
      "Machine Learning & AI tutoring",
      "University applications & research mentoring",
      "Mathematics & algorithmic problem-solving",
      "Technical writing & research paper assistance" 
    ]
  },
  {
    title: "Professional Consultation",
    price: "€75/hour",
    description: "One-on-one consultation for early & mid stage careers.",
    features: [
      "Resume & cover letter optimization (STEM careers)",
      "Interview prep (technical & behavioral)",
      "Startup & accelerator coaching (pitching, ideation)",
      "Tech industry career guidance",
      "Internship & graduate program application support"
    ]
  }
]

export default function AcademicConsultancy() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const setCanvasSize = () => {
      const displayWidth = canvas.clientWidth
      const displayHeight = canvas.clientHeight
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth
        canvas.height = displayHeight
      }
    }

    setCanvasSize()

    class Particle {
      x: number = 0
      y: number = 0
      size: number = 0
      speedX: number = 0
      speedY: number = 0

      constructor() {
        this.reset()
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 1.5 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x < 0 || this.x > canvas.width || 
            this.y < 0 || this.y > canvas.height) {
          this.reset()
        }
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const baseParticleCount = 50
    const particles: Particle[] = []
    
    const createParticles = () => {
      const area = canvas.width * canvas.height
      const particleCount = Math.floor(baseParticleCount * (area / (1920 * 1080)))
      particles.length = 0
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    createParticles()

    function animate() {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      setCanvasSize()
      createParticles()
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full bg-black" />
      
      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-4 md:p-8 bg-black/50 backdrop-blur-md fixed w-full top-0 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 text-gray-200 hover:text-white transition-colors">
          <FiArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-16 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Academic Consultancy</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Expert guidance for STEM, and computer science projects.
            Book a consultation to discuss your needs and get started.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-6 md:p-8 hover:bg-white/10 transition-all duration-300"
            >
              <h2 className="text-2xl font-bold mb-4">{service.title}</h2>
              <p className="text-xl text-blue-400 mb-4">{service.price}</p>
              <p className="text-gray-400 mb-6">{service.description}</p>
              <ul className="space-y-3">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-blue-400">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link 
                href="https://calendly.com/your-calendly-link" 
                target="_blank"
                className="block mt-8 bg-blue-500 text-white px-6 py-3 rounded-lg text-center hover:bg-blue-600 transition-colors"
              >
                Book Consultation
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mb-20"
        >
          <p className="text-gray-400">
            Have questions? Email me at{' '}
            <Link href="mailto:csjoshi2003@gmail.com" className="text-blue-400 hover:text-blue-300">
              csjoshi2003@gmail.com
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  )
} 