"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function News() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Reuse the same particle animation from your main page
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

  const newsArticles = [
    {
      title: "Talent from Stripe, Google and NASA selected for second cycle of Founders",
      publication: "Business Plus",
      date: "January 2025",
      description: "More than 40 participants from engineering and commercial backgrounds have been confirmed for the second cycle of Founders, a 12-week start-up programme taking place at Dogpatch Labs.",
      link: "https://businessplus.ie/media-plus/founders-second-talent/"
    },
    {
        title: "Tech Talent Accelerator Founders Returns with Second Cohort",
        publication: "Business Post",
        date: "January 2025",
        description: "40 promising entrepreneurs join Ireland's premier startup accelerator program at DogPatch Labs, including innovative AI solutions in the latest cohort.",
        link: "https://www.businesspost.ie/news/tech-talent-accelerator-founders-returns-for-second-cohort-as-40-join-programme/"
      },
      {
        title: "Founders Programme Launches Second Cohort at DogPatch Labs",
        publication: "RTÉ News",
        date: "January 2025",
        description: "Ireland's leading startup accelerator welcomes new batch of innovative entrepreneurs, focusing on AI and sustainable technology solutions.",
        link: "https://www.rte.ie/news/business/2025/0131/1493943-founders-programme/"
      },
      {
        title: "Founders Startup Factory Welcomes New Cohort at DogPatch Labs",
        publication: "Think Business",
        date: "January 2025",
        description: "Second cohort of Ireland's most competitive startup accelerator program kicks off, featuring breakthrough technologies in AI and sustainable solutions.",
        link: "https://www.thinkbusiness.ie/articles/founders-startup-factory-dogpatch-second-cohort-ndrc/"
      },
      {
        title: "DogPatch Labs Accelerator Nurtures Next Generation of Tech Entrepreneurs",
        publication: "Silicon Republic",
        date: "January 2025",
        description: "Leading Irish startup hub launches new cohort of innovative founders, focusing on transformative technologies and sustainable solutions.",
        link: "https://www.siliconrepublic.com/start-ups/founders-dogpatch-labs-entrepreneurs-accelerator"
      },
    {
      title: "DCU Mechatronic Engineering Students Excel in Huawei's European Seeds for the Future Programme",
      publication: "DCU Engineering and Computing",
      date: "August 2024",
      description: "Chirag Joshi, a final year Mechatronic Engineering student at DCU, has been selected to represent Ireland in Huawei's prestigious European Seeds for the Future programme, demonstrating exceptional talent in technology and innovation.",
      link: "https://www.dcu.ie/engineeringandcomputing/news/2024/aug/dcu-mechatronic-engineering-students-excel-huaweis-european"
    },
    {
      title: "Irish Students Shine in Huawei's 2024 European Seeds for the Future Programme",
      publication: "Huawei Ireland",
      date: "August 2024",
      description: "Top Irish STEM students, including representatives from DCU, showcase innovative solutions for sustainable development in Huawei's flagship global CSR program.",
      link: "https://www.huawei.com/ie/news/ie/2024/ireland-seeds-2024"
    },
    {
      title: "Students Shine in Huawei 2024 European Seeds for the Future",
      publication: "The Echo",
      date: "August 2024",
      description: "Irish students demonstrate excellence in technology and innovation at Huawei's European-wide program, presenting solutions for sustainable development.",
      link: "https://www.echo.ie/students-shine-in-huawei-2024-european-seeds-for-the-future/"
    },
    {
      title: "Seeds for the Future: Huawei's International Startup Competition",
      publication: "Silicon Republic",
      date: "August 2024",
      description: "How Huawei's Seeds for the Future programme is nurturing the next generation of tech innovators, with Irish students leading the way in IoT and AI solutions.",
      link: "https://www.siliconrepublic.com/machines/seeds-for-the-future-stem-tech-for-good-huawei-iot-ai"
    },

  ]

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full bg-black" />
      
      {/* Navigation - keep it consistent with main page */}
      <nav className="relative z-10 flex justify-between items-center p-4 md:p-8 bg-black/50 backdrop-blur-md fixed w-full top-0 border-b border-white/10" style={{ height: '80px' }}>
      <Link href="/" className="text-3xl md:text-4xl font-semibold text-gray-200 tracking-tight transition duration-300 ease-in-out hover:text-gray-300">
  Chirag Joshi
</Link>
        <div className="flex gap-3 md:gap-6 text-sm md:text-base">
          <Link href="/news" className="bg-gray-200 text-black px-3 py-1 rounded hover:bg-gray-200 transition-colors">Press Coverage</Link>

        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center pt-14 px-4">
        <div className="max-w-4xl w-full mx-auto">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Press Coverage
            
          </motion.h1>
          <p className="text-gray-400 mb-8 text-center">{"Press coverage, featuring me, my work, and my achievements."}</p>
          

          <div className="space-y-8">
            {newsArticles.map((article, index) => (
              <motion.article
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-6 hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
                <div className="flex gap-4 text-sm text-gray-400 mb-4">
                  <span>{article.publication}</span>
                  <span>{article.date}</span>
                </div>
                <p className="text-gray-300 mb-4">{article.description}</p>
                <Link 
                  href={article.link}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read Article →
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
} 