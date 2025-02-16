"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { FiArrowLeft } from 'react-icons/fi'

export default function FoundersJourney() {
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
      color: string = ""

      constructor() {
        this.reset()
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 1.5 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        // Random orange-tinted colors
        const hue = 20 + Math.random() * 20 // Orange hues
        const saturation = 70 + Math.random() * 30
        const lightness = 50 + Math.random() * 10
        this.color = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`
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
        ctx.fillStyle = this.color
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
        <Link 
          href="/" 
          className="flex items-center gap-2 text-gray-200 hover:text-orange-300 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span className="text-lg font-medium">Back to Home</span>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center pt-16 px-4 max-w-4xl mx-auto">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          My Founders Journey
        </motion.h1>



        {/* Placeholder for future blog posts/updates */}
        <motion.div
          className="w-full space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-black/30 backdrop-blur-md rounded-lg p-6 border border-orange-500/10 hover:border-orange-500/30 transition-colors">
            <p className="text-orange-300/90 text-sm mb-2">Coming Soon</p>
            <h2 className="text-xl font-semibold mb-2">The Journey Begins</h2>
            <p className="text-gray-400">First post coming soon...</p>
          </div>
        </motion.div>
      </main>
    </div>
  )
} 