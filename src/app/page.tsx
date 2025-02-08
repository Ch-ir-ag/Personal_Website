"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { FiLinkedin, FiMail } from 'react-icons/fi'

// Add this custom hook at the top of the file
const useTypingEffect = (words: string[]) => {
  const [currentText, setCurrentText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'deleting' | 'waiting'>('typing')
  const currentWord = words[wordIndex]

  useEffect(() => {
    let timeout: NodeJS.Timeout

    switch (phase) {
      case 'typing': {
        if (currentText === currentWord) {
          // Word is fully typed, wait 2 seconds before deleting
          timeout = setTimeout(() => setPhase('deleting'), 2000)
        } else {
          // Type next letter - reduced from 200ms to 150ms
          timeout = setTimeout(() => {
            setCurrentText(currentWord.slice(0, currentText.length + 1))
          }, 100)
        }
        break
      }
      
      case 'deleting': {
        if (currentText === '') {
          // Word is fully deleted, wait before typing next word
          timeout = setTimeout(() => {
            setWordIndex((wordIndex + 1) % words.length)
            setPhase('waiting')
          }, 200)
        } else {
          // Delete last letter
          timeout = setTimeout(() => {
            setCurrentText(currentText.slice(0, -1))
          }, 75)
        }
        break
      }

      case 'waiting': {
        // Reduced waiting time from 500ms to 300ms
        timeout = setTimeout(() => setPhase('typing'), 300)
        break
      }
    }

    return () => clearTimeout(timeout)
  }, [currentText, phase, currentWord, wordIndex, words])

  return currentText
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = []
    const particleCount = 100

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 0.1
        this.speedX = Math.random() * 2 - 1
        this.speedY = Math.random() * 2 - 1
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

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
      if (!canvasRef.current) return
      canvasRef.current.width = window.innerWidth
      canvasRef.current.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Add this array of titles you want to cycle through
  const titles = [
    "Mechatronic Engineer",
    "Entrepreneur",
    "Full Stack Engineer",
    // Add more titles as needed
  ]

  // Use the custom hook
  const displayText = useTypingEffect(titles)

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full bg-black" />
      
      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-4 md:p-8 bg-black/50 backdrop-blur-md fixed w-full top-0 border-b border-white/10">
        <Link href="/" className="text-lg md:text-xl font-bold">
          Chirag Joshi
        </Link>
        <div className="flex gap-3 md:gap-6 text-sm md:text-base">
          <Link href="/about" className="hover:text-gray-300 transition-colors">About</Link>
          <Link href="/projects" className="hover:text-gray-300 transition-colors">Projects</Link>
          <Link href="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
          <Link href="/resume" className="bg-white text-black px-3 py-1 rounded hover:bg-gray-200 transition-colors">
            Resume
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 min-h-[1.2em] px-2" // Adjusted text sizes
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {displayText}
        </motion.h1>
        
        <motion.p
          className="text-gray-400 max-w-2xl mb-12 text-base md:text-lg px-4" // Adjusted text size and added padding
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Building digital experiences with modern technologies. Focused on creating elegant solutions to complex problems.
        </motion.p>

        {/* Social Links */}
        <motion.div
          className="flex gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="https://www.linkedin.com/in/chiragJ2" className="hover:text-gray-300">
            <FiLinkedin className="w-6 h-6" />
          </Link>
          <Link href="mailto:csjoshi2003@gmail.com" className="hover:text-gray-300">
            <FiMail className="w-6 h-6" />
          </Link>
        </motion.div>
      </main>

      {/* Projects Section */}
      <section className="relative z-10 py-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="aspect-video bg-gray-800 flex items-center justify-center">
                {/* Project thumbnail/placeholder */}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-400">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

// Sample project data
const projects = [
  {
    title: "E-commerce Platform",
    description: "A full-stack e-commerce solution built with modern technologies.",
  },
  {
    title: "Task Management App",
    description: "A collaborative task management application for teams.",
  },
  {
    title: "AI Chat Interface",
    description: "An intelligent chatbot interface powered by machine learning.",
  },
]
