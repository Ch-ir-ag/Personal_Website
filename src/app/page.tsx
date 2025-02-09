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
          }, 50)
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

  const highlights = [
    {
      title: "Ranked Top 1% of Talent in Ireland by DogPatch Labs",
      description: "Ireland's most competitive startup accelerator"
    },
    {
      title: "Graduated rank #2 in Mechatronics Engineering",
      description: "From Dublin City University"
    },
    {
      title: "Won 3rd place in BT Young Scientist (Physics, Chemistry, and Maths)",
      description: "By disproving a half-a-century old math lemma"
    },
    {
      title: "Saved a projected €26 million annually during my internship ",
      description: "Developed a Real Time Asset Location Tracking System for AbbVie"
    },
    // Adding 3 more boxes for the bottom row
    {
      title: "Ranked top 10 STEM Students in Ireland by Huawei",
      description: "Selection for the Irish team for Huawei's International Startup Competition  - Seeds for the Future"
    },
    {
      title: "Ranked top 5 in Huawei's Internation Startup Competition",
      description: "Developed an AI-driven prototype for solving Ireland's water sanitation problem"
    },
    {
      title: "Developed an AI-driven ML model for energy prediction for my thesis",
      description: "To be showcased globally in 2025"
    }
  ]

  // Add this near your other data constants
  const workExperience = [
    {
      role: "Founder - CTO",
      company: "Resident at Founders - DogPatch Labs",
      period: "December 2024 - Present",
      description: "Building a stealth startup in Ireland's most competitive startup accelerator (1% acceptance rate) with a mission to disrupt the AI industry",
      technologies: ["That's a secret"]
    },
    {
      role: "Information Technology Associate",
      company: "KPMG",
      period: "September 2024 - December 2024",
      description: "Implemented automated audit procedures to streamline risk assessments and improve the efficiency of compliance checks across various software platforms. ",
      technologies: ["Python","IT Audit","Automation"]
    },
    {
      role: "Engineering Co-Op",
      company: "AbbVie",
      period: "April 2023 - September 2023",
      description: "Led the development of a real-time asset location tracking system (RTALS) project to track tools and assets within the organization, optimizing resource management. Resulting in a 95% increase in workplace efficiency with a projected €26 million+ saved per year. Researched technologies such as RFID, BLE and UBW.  ",
      technologies: ["Python", "Automation", "C++", "IoT"]
    },
    {
      role: "Software Engineering Intern",
      company: "ESB",
      period: "July 2022 - September 2022",
      description: "Automated high and medium voltage substation condition monitoring system, leveraging SQL for data organization in the database. ",
      technologies: ["Python", "C++", "SQL"]
    }
  ]

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full bg-black" />
      
      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-4 md:p-8 bg-black/50 backdrop-blur-md fixed w-full top-0 border-b border-white/10" style={{ height: '70px' }}>
        <Link href="/" className="text-lg md:text-xl font-bold">
          Chirag Joshi
        </Link>
        <div className="flex gap-3 md:gap-6 text-sm md:text-base">
          <Link href="/news" className="hover:text-gray-300 transition-colors">News</Link>
          <Link href="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
          <Link href="/resume" className="bg-white text-black px-3 py-1 rounded hover:bg-gray-200 transition-colors">
            Resume
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center pt-32 px-4">
        {/* Title Section */}
        <div className="text-center mb-20 w-full max-w-4xl mx-auto">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 min-h-[1.2em] whitespace-normal px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {displayText}
          </motion.h1>
          
          <motion.p
            className="text-gray-400 max-w-2xl mx-auto mb-8 text-base md:text-lg px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            key="description"
          >
            Hey, I'm Chirag Joshi.
          </motion.p>

          {/* Social Links */}
          <motion.div
            className="flex justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            key="social-links"
          >
            <Link href="https://www.linkedin.com/in/chiragJ2" className="hover:text-gray-300">
              <FiLinkedin className="w-6 h-6" />
            </Link>
            <Link href="mailto:csjoshi2003@gmail.com" className="hover:text-gray-300">
              <FiMail className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>

        {/* Highlights Grid */}
        <div className="flex flex-col gap-4 md:gap-6 max-w-7xl mx-auto w-full px-4">
          {/* Top row - 4 boxes */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {highlights.slice(0, 4).map((highlight, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-4 md:p-6 hover:bg-white/10 transition-colors flex flex-col items-center text-center h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <h3 className="text-lg md:text-xl font-semibold mb-3">{highlight.title}</h3>
                <p className="text-gray-400 text-sm md:text-base">{highlight.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Bottom row - 3 boxes */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:px-[12.5%]">
            {highlights.slice(4).map((highlight, index) => (
              <motion.div
                key={index + 4}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-4 md:p-6 hover:bg-white/10 transition-colors flex flex-col items-center text-center h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: (index + 4) * 0.1 }}
              >
                <h3 className="text-lg md:text-xl font-semibold mb-3">{highlight.title}</h3>
                <p className="text-gray-400 text-sm md:text-base">{highlight.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Work Experience Section */}
        <section className="relative z-10 py-20 px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Work Experience</h2>
          <div className="max-w-4xl mx-auto">
            {workExperience.map((work, index) => (
              <motion.div
                key={index}
                className="mb-12 relative pl-8 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-white/10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-2 w-2 h-2 bg-blue-400 rounded-full transform -translate-x-1/2" />
                
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{work.role}</h3>
                    <span className="text-blue-400 text-sm">{work.period}</span>
                  </div>
                  
                  <h4 className="text-lg text-gray-300 mb-4">{work.company}</h4>
                  
                  <p className="text-gray-400 mb-4">
                    {work.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {work.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
