"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FiArrowLeft } from 'react-icons/fi'

const services = [
  {
    title: "Project Consultation",
    price: "€60/hour",
    description: "One-on-one consultation for engineering and computer science projects. Get expert guidance on:",
    features: [
      "Algorithm optimization",
      "System architecture design",
      "Technical implementation",
      "Problem-solving strategies",
      "Code review and best practices"
    ]
  },
  {
    title: "Research & Thesis Support",
    price: "€75/hour",
    description: "Comprehensive support for academic research and thesis development:",
    features: [
      "Research methodology guidance",
      "Data analysis assistance",
      "Technical writing review",
      "Literature review strategy",
      "Presentation preparation"
    ]
  }
]

export default function AcademicConsultancy() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-4 md:p-8 bg-black/50 backdrop-blur-md fixed w-full top-0 border-b border-white/10 z-50">
        <Link href="/" className="flex items-center gap-2 text-gray-200 hover:text-white transition-colors">
          <FiArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="pt-32 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Academic Consultancy</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Expert guidance for engineering, mathematics, and computer science projects.
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