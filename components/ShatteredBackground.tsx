'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

type CollectionType = 'essence' | 'fragment' | 'recode' | 'general'

interface ShatteredBackgroundProps {
  variant?: CollectionType
  intensity?: 'low' | 'medium' | 'high'
}

// SVG Fragment paths extracted from the shattered logo
const fragmentPaths = {
  // ESSENCE - Organized, flowing fragments (left side pieces)
  essence: [
    "M-383.28-44.11l14.11,33.63-28.26,13.44,20.48,13.78c2.52.13,11.96-8.23,14.94-10.02.91-.54.48-1.35,1.63.02,3.68,4.4,6.57,17.48,10.37,22.89l-9.09,17.92,11.24-12.48,57.9,124.13",
    "M-584.9,200.85l20.87-12.04,3.27-.43,1.34,6.66-14.82,28.13-88.96,34.34c-.97-.91,6.49-7.82,7.48-8.76",
    "M-440.75-59.11l13.33-5.82c-1.99,12.2-3.53,25.15-7.86,36.71-7.41,3.94-20.74,21.36-27.74,23.09",
    "M-577.4,160.86c.24,1.3-.13,1.93-.79,2.95-3.07,4.74-10.96,9.12-14.62,13.7",
    "M-533.24-47.86c.02,2.72,1.57,4.46-.8,8.15-.74,1.16-3.01.97-2.53,3.09l6.31,1.64",
    "M-593.3,3.44l9.1,17.18c.13,1.48-10.52,12.7-12.44,13.94-4.68,3.01-16.15,5.22-19.54,7.95",
  ],
  
  // FRAGMENT - Scattered, chaotic broken pieces (center shattered pieces)
  fragment: [
    "M448.28,215.85l13.87,33.05-27.77,13.2,20.13,13.54c2.47.13,11.75-8.09,14.68-9.84",
    "M250.15,456.56l20.5-11.83,3.21-.42,1.31,6.54-14.57,27.64-87.42,33.75",
    "M391.8,201.1l13.1-5.72c-1.95,11.99-3.47,24.72-7.72,36.07-7.28,3.87-20.38,20.99-27.26,22.69",
    "M257.52,417.27c.24,1.27-.13,1.9-.78,2.9-3.02,4.66-10.77,8.96-14.37,13.47",
    "M410.63,133.16l-24.65,47.81-9.63,5.93-13.17,30.22-6.58,1.19",
    "M436.01,47.19l-13.76,66.06c-4.8,11.09-22.57,12.42-32.08,18.27",
    "M300.92,212.16c.02,2.67,1.54,4.38-.78,8.01-.73,1.14-2.95.95-2.49,3.04",
    "M323.84,264.16l-.99,10.48-18.65,15.32c.76,1.31,1.84-.3,2.54-.74",
    "M241.9,262.58l8.94,16.88c.12,1.45-10.34,12.48-12.22,13.69",
    "M258.34,227.3l-23.74,17.62c.76,1.31,1.84-.31,2.53-.74",
  ],
  
  // RECODE - Text-based, geometric fragments
  recode: [
    "M919.06,450.57l-.12,2.23-1.13,1.69-1.58-2.01.33,1.23-.85.39",
    "M925.44,448.01l-.03,1.71c-.98.37-1.73,1.14-2.58,1.71",
    "M923.14,454.27c-.11.14-.97.72-1.14.68-.25-.05-1.8-1.6-1.78-1.73",
    "M979.52,445.3c-.2.34,2.22,6.63,2.48,7.51-.02.23-1.09,1.43-1.31,1.54",
    "M976.05,452.74c-.66.14-1.36-.09-1.7-.68l.18-3.86",
    "M984.03,448.15l.21,3.83-1.89.49-.64-1.49",
    "M953.38,457.52l.8-.87c.64-.14,1.3.01,1.89.26",
    "M945.51,457.52c-.72-.11-.76-.63-.15-.92l-.41-.1",
  ],
  
  // GENERAL - Mixed fragments for general use
  general: [
    "M-395.77-215.74l-14,67.22c-4.88,11.29-22.97,12.64-32.64,18.59",
    "M506.43,281.34l31.92-49.94c.34,7.4-.63,14.72-1.24,22.09",
    "M-636.66,130.96c1.44,2.48-8.06,9.05-8.22,12.4l13.74-9.98",
    "M199.29,387.89c1.42,2.44-7.92,8.89-8.08,12.18l13.51-9.81",
    "M-675.71,79.21c4.72-16.28,13.09-31.26,22.9-44.98l14.18,13.32",
    "M160.92,337.03c4.64-16,12.86-30.72,22.51-44.2l13.94,13.09",
  ]
}

// Fragment positioning configurations
const fragmentConfigs = {
  essence: [
    { x: '10%', y: '15%', scale: 0.8, rotation: -15, direction: 'left' },
    { x: '75%', y: '20%', scale: 0.6, rotation: 10, direction: 'right' },
    { x: '15%', y: '60%', scale: 0.7, rotation: 5, direction: 'left' },
    { x: '80%', y: '70%', scale: 0.5, rotation: -10, direction: 'bottom' },
    { x: '40%', y: '10%', scale: 0.6, rotation: 20, direction: 'top' },
    { x: '60%', y: '85%', scale: 0.7, rotation: -5, direction: 'bottom' },
  ],
  fragment: [
    { x: '8%', y: '12%', scale: 0.5, rotation: 25, direction: 'top' },
    { x: '88%', y: '18%', scale: 0.6, rotation: -20, direction: 'right' },
    { x: '5%', y: '45%', scale: 0.7, rotation: 15, direction: 'left' },
    { x: '92%', y: '55%', scale: 0.5, rotation: -30, direction: 'right' },
    { x: '15%', y: '78%', scale: 0.6, rotation: 10, direction: 'bottom' },
    { x: '85%', y: '82%', scale: 0.7, rotation: -15, direction: 'bottom' },
    { x: '35%', y: '8%', scale: 0.5, rotation: 35, direction: 'top' },
    { x: '65%', y: '90%', scale: 0.6, rotation: -25, direction: 'bottom' },
    { x: '25%', y: '35%', scale: 0.4, rotation: 20, direction: 'left' },
    { x: '75%', y: '40%', scale: 0.5, rotation: -10, direction: 'right' },
  ],
  recode: [
    { x: '12%', y: '18%', scale: 0.6, rotation: 0, direction: 'top' },
    { x: '78%', y: '22%', scale: 0.5, rotation: 90, direction: 'right' },
    { x: '20%', y: '50%', scale: 0.7, rotation: 0, direction: 'left' },
    { x: '82%', y: '58%', scale: 0.6, rotation: 90, direction: 'right' },
    { x: '18%', y: '75%', scale: 0.5, rotation: 0, direction: 'bottom' },
    { x: '80%', y: '80%', scale: 0.7, rotation: 90, direction: 'bottom' },
    { x: '45%', y: '12%', scale: 0.6, rotation: 0, direction: 'top' },
    { x: '55%', y: '88%', scale: 0.5, rotation: 90, direction: 'bottom' },
  ],
  general: [
    { x: '15%', y: '20%', scale: 0.6, rotation: -10, direction: 'left' },
    { x: '75%', y: '25%', scale: 0.7, rotation: 15, direction: 'right' },
    { x: '25%', y: '55%', scale: 0.5, rotation: 5, direction: 'left' },
    { x: '80%', y: '65%', scale: 0.6, rotation: -15, direction: 'right' },
    { x: '40%', y: '15%', scale: 0.7, rotation: 20, direction: 'top' },
    { x: '60%', y: '80%', scale: 0.5, rotation: -5, direction: 'bottom' },
  ]
}

export default function ShatteredBackground({ 
  variant = 'general',
  intensity = 'medium' 
}: ShatteredBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Get fragments for the specified variant
  const fragments = fragmentPaths[variant] || fragmentPaths.general
  const configs = fragmentConfigs[variant] || fragmentConfigs.general

  // Opacity based on intensity
  const opacityMap = {
    low: 0.03,
    medium: 0.06,
    high: 0.1
  }
  const baseOpacity = opacityMap[intensity]

  // Calculate translation distance based on direction
  const getTranslation = (direction: string) => {
    switch (direction) {
      case 'top': return { x: 0, y: -100 }
      case 'bottom': return { x: 0, y: 100 }
      case 'left': return { x: -100, y: 0 }
      case 'right': return { x: 100, y: 0 }
      default: return { x: 0, y: 0 }
    }
  }

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {fragments.slice(0, configs.length).map((path, index) => {
        const config = configs[index]
        const translation = getTranslation(config.direction)
        
        // Transform based on scroll progress
        const x = useTransform(
          scrollYProgress,
          [0, 0.5, 1],
          [translation.x, 0, -translation.x]
        )
        
        const y = useTransform(
          scrollYProgress,
          [0, 0.5, 1],
          [translation.y, 0, -translation.y]
        )
        
        const opacity = useTransform(
          scrollYProgress,
          [0, 0.3, 0.7, 1],
          [0, baseOpacity, baseOpacity, 0]
        )

        return (
          <motion.div
            key={index}
            className="absolute"
            style={{
              left: config.x,
              top: config.y,
              x,
              y,
              opacity,
              rotate: config.rotation,
              scale: config.scale,
              willChange: 'transform, opacity'
            }}
            initial={{ opacity: 0 }}
            whileInView={{ 
              opacity: baseOpacity,
              transition: {
                duration: 1,
                delay: index * 0.1,
                ease: 'easeOut'
              }
            }}
            viewport={{ once: false, margin: "-20%" }}
          >
            <svg
              width="200"
              height="200"
              viewBox="-800 -300 1600 900"
              className="text-black"
              style={{
                filter: 'blur(0.5px)',
                transform: `scale(${1 / config.scale})` // Normalize viewBox scale
              }}
            >
              <path
                d={path}
                fill="currentColor"
                opacity={0.8}
              />
            </svg>
          </motion.div>
        )
      })}
      
      {/* Additional subtle texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(0,0,0,0.03) 0%, transparent 50%),
                           radial-gradient(circle at 80% 50%, rgba(0,0,0,0.03) 0%, transparent 50%)`
        }}
      />
    </div>
  )
}

