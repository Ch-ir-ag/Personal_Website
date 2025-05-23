"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { FiLinkedin, FiGithub } from 'react-icons/fi'

// Custom hook for typing effect (remains unchanged)
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
          timeout = setTimeout(() => setPhase('deleting'), 2000)
        } else {
          timeout = setTimeout(() => {
            setCurrentText(currentWord.slice(0, currentText.length + 1))
          }, 100)
        }
        break
      }
      
      case 'deleting': {
        if (currentText === '') {
          timeout = setTimeout(() => {
            setWordIndex((wordIndex + 1) % words.length)
            setPhase('waiting')
          }, 25)
        } else {
          timeout = setTimeout(() => {
            setCurrentText(currentText.slice(0, -1))
          }, 75)
        }
        break
      }

      case 'waiting': {
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
  const mousePositionRef = useRef<{ x: number | undefined; y: number | undefined }>({ x: undefined, y: undefined });


  // UPDATED useEffect for the new canvas background
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

    const handleMouseMove = (event: MouseEvent) => {
      mousePositionRef.current = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      originalSpeedX: number; // To store base speed
      originalSpeedY: number; // To store base speed

      constructor() {
        this.x = 0;
        this.y = 0;
        this.size = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.originalSpeedX = 0;
        this.originalSpeedY = 0;
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.8; // Smaller, more delicate particles: 0.8px to 2.3px
        
        // Slower base speed
        this.originalSpeedX = (Math.random() - 0.5) * 0.3; 
        this.originalSpeedY = (Math.random() - 0.5) * 0.3;
        this.speedX = this.originalSpeedX;
        this.speedY = this.originalSpeedY;
      }

      update() {
        // Mouse interaction
        const mouse = mousePositionRef.current;
        if (mouse.x !== undefined && mouse.y !== undefined) {
          const dx_mouse = this.x - mouse.x;
          const dy_mouse = this.y - mouse.y;
          const distance_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse);
          const interaction_radius = 100; // Radius of mouse influence
          
          if (distance_mouse < interaction_radius) {
            const force = (interaction_radius - distance_mouse) / interaction_radius;
            // Add a gentle push away from the mouse
            this.speedX += (dx_mouse / distance_mouse) * force * 0.15; // Adjust strength (0.15 here)
            this.speedY += (dy_mouse / distance_mouse) * force * 0.15;
          }
        }

        // Apply friction/drag to eventually return to original speed or slow down
        this.speedX += (this.originalSpeedX - this.speedX) * 0.01; // Gently pull back to original speed
        this.speedY += (this.originalSpeedY - this.speedY) * 0.01;


        // Max speed limit to prevent particles from flying off too fast
        const maxSpeed = 1.0; 
        const currentSpeed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
        if (currentSpeed > maxSpeed) {
          this.speedX = (this.speedX / currentSpeed) * maxSpeed;
          this.speedY = (this.speedY / currentSpeed) * maxSpeed;
        }
        
        this.x += this.speedX;
        this.y += this.speedY;

        // Reset particle if it goes off screen
        if (this.x < -this.size || this.x > canvas.width + this.size || 
            this.y < -this.size || this.y > canvas.height + this.size) {
          this.reset();
          // Place particle on opposite side for smoother continuous flow
          if (this.x < -this.size) this.x = canvas.width + this.size;
          else if (this.x > canvas.width + this.size) this.x = -this.size;
          if (this.y < -this.size) this.y = canvas.height + this.size;
          else if (this.y > canvas.height + this.size) this.y = -this.size;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = "rgba(200, 200, 255, 0.6)"; // Bluish-white, slightly transparent
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const baseParticleCount = 60; // Slightly increased for better constellation density
    const particles: Particle[] = [];
    
    const createParticles = () => {
      const area = canvas.width * canvas.height;
      // Adjusted scaling for denser small screens, capped for very large screens
      const targetDensity = baseParticleCount / (1920 * 1080);
      let particleCount = Math.floor(targetDensity * area);
      particleCount = Math.max(30, Math.min(150, particleCount)); // Min 30, Max 150 particles

      particles.length = 0; // Clear existing particles
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    createParticles();

    const connectDistance = 110; // Max distance to draw a line between particles

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (const particle of particles) {
        particle.update();
        particle.draw();
      }

      // Connect particles with lines
      ctx.lineWidth = 0.35; // Thin lines for a delicate look
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectDistance) {
            const opacity = Math.max(0, (1 - distance / connectDistance) * 0.35); // Max opacity 0.35 for lines
            ctx.strokeStyle = `rgba(200, 200, 255, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      setCanvasSize();
      createParticles(); // Re-create particles for new size
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      // Consider canceling animation frame if component unmounts, though requestAnimationFrame stops if tab is inactive
    };
  }, []); // Empty dependency array: effect runs once on mount and cleans up on unmount

  const titles = [
    "Mechatronic Engineer",
    "Entrepreneur",
    "Full Stack Engineer",
    "AI Engineer",
  ];
  const displayText = useTypingEffect(titles);

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
  ];

  const workExperience = [
    {
      role: "Co-Founder & CTO",
      company: "Daisy AI",
      period: "February 2025 - Present",
      description: "Building a decision making engine for Dairy Processors",
      technologies: ["Predictive Analytics"]
    },
    {
      role: "Resident at Founders",
      company: "DogPatch Labs",
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
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Canvas is now behind everything else, ensure content has z-index if needed */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full bg-black -z-10" />
      
      <nav className="relative z-20 flex justify-between items-center p-4 md:p-8 bg-black/50 backdrop-blur-md fixed w-full top-0 border-b border-white/10" style={{ height: '80px' }}>
        <Link href="/" className="text-3xl md:text-4xl font-semibold text-gray-200 tracking-tight transition duration-300 ease-in-out hover:text-gray-300">
          Chirag Joshi
        </Link>
        <div className="flex gap-3 md:gap-6 text-sm md:text-base">
          <Link href="/news" className="bg-gray-200 text-black px-3 py-1 rounded hover:bg-gray-200 transition-colors">Press Coverage</Link>
        </div>
      </nav>
      
      <motion.section 
        className="relative z-20 sticky top-[80px] w-full bg-gradient-to-r from-white/10 to-stone-200/10 h-16 md:h-20 backdrop-blur-sm flex items-center justify-between border-b border-white/10"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        aria-label="Visit Daisy AI – The decision making engine for Dairy Processors"
      >
        <Link 
          href="https://www.joindaisy.co" 
          target="_blank" 
          rel="noopener"
          className="w-full h-full flex items-center justify-center px-4 md:px-8 group"
        >
          <div className="flex items-center justify-center flex-grow">
            <motion.span 
              className="text-2xl mr-3"
              animate={{ 
                scale: [1, 1.15, 1],
                opacity: [1, 0.9, 1]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              🌼
            </motion.span>
            <p className="text-sm md:text-base text-gray-300">
              Discover <span className="font-semibold">Daisy AI</span> – The decision making engine for Dairy Processors
            </p>
          </div>
          <motion.div
            className="text-gray-300 flex items-center"
            whileHover={{ x: 4 }}
          >
            <span className="hidden md:inline mr-2">Learn more</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </motion.div>
        </Link>
      </motion.section>

      <main className="relative z-10 flex flex-col items-center pt-24 md:pt-28 px-4">
        <div className="text-center mb-20 w-full max-w-4xl mx-auto">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 min-h-[1.2em] px-4 text-gray-100" // Ensured text color for visibility
            style={{
              fontSize: 'clamp(1.5rem, 5vw, 4.5rem)',
              lineHeight: 1.2,
              whiteSpace: 'nowrap'
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

          <motion.div
            className="flex justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            key="social-links"
          >
            <Link href="https://www.linkedin.com/in/chiragJ2" className="text-gray-300 hover:text-gray-100">
              <FiLinkedin className="w-6 h-6" />
            </Link>
            <Link href="https://github.com/Ch-ir-ag" className="text-gray-300 hover:text-gray-100">
              <FiGithub className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>

        <div className="flex flex-col gap-4 md:gap-6 max-w-7xl mx-auto w-full px-4 -mt-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {highlights.slice(0, 4).map((highlight, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-4 md:p-6 hover:bg-white/10 transition-all duration-300 
                           flex flex-col items-center text-center h-full group relative overflow-hidden cursor-pointer" // Changed cursor
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                onClick={() => setActiveBox(activeBox === index ? null : index)}
              >
                <div className={`transform transition-all duration-300 ease-in-out text-gray-100
                  ${activeBox === index ? 'opacity-0 scale-90' : 'group-hover:opacity-0 group-hover:scale-90 opacity-100 scale-100'}`}>
                  <div className="text-3xl mb-2">{highlight.emoji}</div>
                  <h3 className="text-lg md:text-xl font-semibold">{highlight.title}</h3>
                </div>
                <div className={`absolute inset-0 p-4 bg-white/5 backdrop-blur-sm 
                  transition-all duration-300 ease-in-out flex items-center justify-center
                  ${activeBox === index ? 'opacity-100 scale-100' : 'group-hover:opacity-100 group-hover:scale-100 opacity-0 scale-90'}`}>
                  <p className="text-gray-300 text-sm md:text-base">{highlight.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {highlights.slice(4).map((highlight, index) => (
              <motion.div
                key={index + 4}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-4 md:p-6 hover:bg-white/10 transition-all duration-300 
                           flex flex-col items-center text-center h-full group relative overflow-hidden" // Base styles
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: (index + 4) * 0.1 }}
              >
                {index === 3 && ( // Special handling for the linkable box
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
                  className="w-full h-full flex flex-col items-center justify-center text-center cursor-pointer" // Make link take full space
                  onClick={(e) => {
                    if (index !== 3) { // If not the linkable box, prevent default and toggle active state
                      e.preventDefault();
                      setActiveBox(activeBox === (index + 4) ? null : (index + 4));
                    }
                    // If it IS the linkable box (index === 3), Link's default behavior will navigate
                  }}
                >
                  <div className={`transform transition-all duration-300 ease-in-out text-gray-100
                    ${activeBox === (index + 4) ? 'opacity-0 scale-90' : 'group-hover:opacity-0 group-hover:scale-90 opacity-100 scale-100'}`}>
                    <div className="text-3xl mb-2">{highlight.emoji}</div>
                    <h3 className="text-lg md:text-xl font-semibold">{highlight.title}</h3>
                  </div>
                  <div className={`absolute inset-0 p-4 bg-white/5 backdrop-blur-sm 
                    transition-all duration-300 ease-in-out flex items-center justify-center
                    ${activeBox === (index + 4) ? 'opacity-100 scale-100' : 'group-hover:opacity-100 group-hover:scale-100 opacity-0 scale-90'}`}>
                    <p className="text-gray-300 text-sm md:text-base">{highlight.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <section className="relative z-10 py-20 px-4 w-full">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-100">Where I have been</h2>
          <div className="max-w-4xl mx-auto">
            {workExperience.map((work, index) => (
              <motion.div
                key={index}
                className="mb-12 relative pl-8 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-white/10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <div className="absolute left-0 top-2 w-2 h-2 bg-blue-400 rounded-full transform -translate-x-[calc(50%-1px)]" /> 
                
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{work.role}</h3>
                    <span className="text-blue-400 text-sm mt-1 md:mt-0">{work.period}</span>
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