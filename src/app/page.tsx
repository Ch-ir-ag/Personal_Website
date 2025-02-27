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
          }, 25)
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
  const [activeBox, setActiveBox] = useState<number | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const setCanvasSize = () => {
      // Get the actual display size of the canvas
      const displayWidth = canvas.clientWidth
      const displayHeight = canvas.clientHeight

      // Check if the canvas size needs to be updated
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
        this.size = Math.random() * 2 + 1.5  // Increased from 1.5 + 0.5 to 2 + 0.8
        this.speedX = (Math.random() - 0.5) * 1.2  // Increased from 0.5 to 0.8
        this.speedY = (Math.random() - 0.5) * 1.2  // Increased from 0.5 to 0.8
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Reset particle if it goes off screen
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

    // Calculate particle count based on screen area
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

  // Add this array of titles you want to cycle through
  const titles = [
    "Mechatronic Engineer",
    "Entrepreneur",
    "Full Stack Engineer",
    "Academic Consultant",
    // Add more titles as needed
  ]

  // Use the custom hook
  const displayText = useTypingEffect(titles)

  const highlights = [
    {
      title: "Top 1% of talent  Ireland 2025",
      emoji: "🏆",
      description: "Ranked Top 1% of Talent in Ireland by DogPatch Labs - Ireland's most competitive startup accelerator"
    },
    {
      title: "Rank #2 Graduate",
      emoji: "🎓",
      description: "Graduated rank #2 in Mechatronics Engineering from Dublin City University"
    },
    {
      title: "3rd Place BT Young Scientist",
      emoji: "👨🏻‍🔬",
      description: "Won 3rd place in BT Young Scientist (Physics, Chemistry, and Maths) by disproving a half-a-century old math lemma"
    },
    {
      title: "€26M Impact",
      emoji: "💸",
      description: "Saved a projected €26 million annually at AbbVie by developing a Real Time Asset Location Tracking System"
    },
    {
      title: "Top 10 STEM students 2024",
      emoji: "🍀",
      description: "Selection for the Irish team for Huawei's International Startup Competition - Seeds for the Future"
    },
    {
      title: "Global Top 5",
      emoji: "🌍",
      description: "Ranked top 5 in Huawei's International Startup Competition with an AI-driven water sanitation solution"
    },
    {
      title: "AI Research",
      emoji: "🤖",
      description: "Made an AI-ML model for energy prediction, to be showcased globally in 2025"
    },
    {
      title: "Academic Consultancy",
      emoji: "📚",
      description: "Providing expert guidance for academic and research projects in engineering, mathematics, and computer science"
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
      <nav className="relative z-10 flex justify-between items-center p-4 md:p-8 bg-black/50 backdrop-blur-md fixed w-full top-0 border-b border-white/10" style={{ height: '80px' }}>
        <Link href="/" className="text-3xl md:text-4xl font-semibold text-gray-200 tracking-tight transition duration-300 ease-in-out hover:text-gray-300">
          Chirag Joshi
        </Link>
        <div className="flex gap-3 md:gap-6 text-sm md:text-base">
          <Link href="/news" className="bg-gray-200 text-black px-3 py-1 rounded hover:bg-gray-200 transition-colors">Press Coverage</Link>
        </div>
      </nav>

      {/* FoodTracker Waitlist Banner */}
      <Link 
        href="https://food-expiry-tracker-sigma.vercel.app/" 
        className="relative z-10 flex justify-center items-center h-10 bg-gradient-to-r from-black/20 to-blue-700/20 hover:from-black/30 hover:to-blue-700/30
backdrop-blur-md fixed w-full top-[0px] border-y border-white/10 transition-all duration-300"
      >
        <div className="flex items-center gap-2 text-blue-200/90 hover:text-blue-100 transition-colors">
          <span className="text-sm font-medium tracking-wide">
            🚀 Join the wait list at FoodTracker
          </span>
          <svg 
            className="w-3.5 h-3.5 transform transition-transform group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center pt-44 px-4">
        {/* Title Section */}
        <div className="text-center mb-20 w-full max-w-4xl mx-auto">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 min-h-[1.2em] px-4"
            style={{
              fontSize: 'clamp(1.5rem, 5vw, 4.5rem)',
              lineHeight: 1.2,
              whiteSpace: 'nowrap'  // Prevent text wrapping
            }}
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
            {"Hey, I'm Chirag Joshi."}
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
        <div className="flex flex-col gap-4 md:gap-6 max-w-7xl mx-auto w-full px-4 -mt-8">
          {/* Top row - 4 boxes */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {highlights.slice(0, 4).map((highlight, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-4 md:p-6 hover:bg-white/10 transition-all duration-300 
                           flex flex-col items-center text-center h-full group relative overflow-hidden cursor-none md:cursor-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                onClick={() => setActiveBox(activeBox === index ? null : index)}
              >
                <div className={`transform transition-all duration-300 ease-in-out
                  ${activeBox === index ? 'opacity-0' : 'group-hover:opacity-0 opacity-100'}`}>
                  <div className="text-3xl mb-2">{highlight.emoji}</div>
                  <h3 className="text-lg md:text-xl font-semibold">{highlight.title}</h3>
                </div>
                <div className={`absolute inset-0 p-4 bg-white/5 backdrop-blur-sm 
                  transition-all duration-300 ease-in-out flex items-center justify-center
                  ${activeBox === index ? 'opacity-100' : 'group-hover:opacity-100 opacity-0'}`}>
                  <p className="text-gray-300 text-sm md:text-base">{highlight.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom row - 4 boxes */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {highlights.slice(4).map((highlight, index) => (
              <motion.div
                key={index + 4}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-4 md:p-6 hover:bg-white/10 transition-all duration-300 
                           flex flex-col items-center text-center h-full group relative overflow-hidden cursor-none md:cursor-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: (index + 4) * 0.1 }}
              >
                {index === 3 && (
                  <motion.div
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{
                      boxShadow: [
                        '0 0 0 0 rgba(255, 255, 255, 0)',
                        '0 0 0 2px rgba(255, 255, 255, 0.2)',
                        '0 0 0 0 rgba(255, 255, 255, 0)'
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                  />
                )}
                
                <Link 
                  href={index === 3 ? '/academic-consultancy' : '#'}
                  className="w-full h-full"
                  onClick={(e) => {
                    if (index !== 3) {
                      e.preventDefault();
                      setActiveBox(activeBox === (index + 4) ? null : (index + 4));
                    }
                  }}
                >
                  <div className={`transform transition-all duration-300 ease-in-out
                    ${activeBox === (index + 4) ? 'opacity-0' : 'group-hover:opacity-0 opacity-100'}`}>
                    <div className="text-3xl mb-2">{highlight.emoji}</div>
                    <h3 className="text-lg md:text-xl font-semibold">{highlight.title}</h3>
                  </div>
                  <div className={`absolute inset-0 p-4 bg-white/5 backdrop-blur-sm 
                    transition-all duration-300 ease-in-out flex items-center justify-center
                    ${activeBox === (index + 4) ? 'opacity-100' : 'group-hover:opacity-100 opacity-0'}`}>
                    <p className="text-gray-300 text-sm md:text-base">{highlight.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Work Experience Section */}
        <section className="relative z-10 py-20 px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Where I have been</h2>
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
