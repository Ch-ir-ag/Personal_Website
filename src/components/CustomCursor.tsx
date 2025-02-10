"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState(false)
  const [isMobile, setIsMobile] = useState(true) // Start with true to prevent flicker

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      const target = e.target as HTMLElement
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer')
    }

    window.addEventListener('mousemove', updateMousePosition)
    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  if (isMobile) return null

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full mix-blend-difference pointer-events-none z-50"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
          scale: isPointer ? 1.5 : 1,
        }}
        transition={{
          type: "tween",
          duration: 0.09,
          ease: "linear"
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-white rounded-full mix-blend-difference pointer-events-none z-50"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isPointer ? 1.5 : 1,
        }}
        transition={{
          type: "tween",
          duration: 0,
          ease: "linear"
        }}
      />
    </>
  )
} 