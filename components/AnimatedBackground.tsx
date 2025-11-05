'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Shape {
  id: number
  size: number
  x: number
  y: number
  rotation: number
  duration: number
  delay: number
  type: 'triangle' | 'polygon'
  opacity: number
}

const generateShapes = (): Shape[] => {
  const shapes: Shape[] = []
  
  // Create shapes distributed across entire viewport
  // Include shapes at the edges to ensure full coverage
  const positions = [
    // Far left column
    { x: -5, y: 20 },
    { x: -3, y: 50 },
    { x: -5, y: 80 },
    
    // Left column
    { x: 10, y: 15 },
    { x: 12, y: 45 },
    { x: 10, y: 75 },
    
    // Center-left column
    { x: 30, y: 25 },
    { x: 32, y: 55 },
    { x: 30, y: 85 },
    
    // Center column
    { x: 50, y: 10 },
    { x: 48, y: 40 },
    { x: 50, y: 70 },
    
    // Center-right column
    { x: 70, y: 20 },
    { x: 68, y: 50 },
    { x: 70, y: 80 },
    
    // Right column
    { x: 88, y: 15 },
    { x: 90, y: 45 },
    { x: 88, y: 75 },
    
    // Far right column
    { x: 103, y: 25 },
    { x: 105, y: 55 },
    { x: 103, y: 85 },
  ]
  
  positions.forEach((pos, i) => {
    shapes.push({
      id: i,
      size: Math.random() * 60 + 40, // 40-100px
      x: pos.x,
      y: pos.y + (Math.random() * 10 - 5), // Add some Y variation
      rotation: Math.random() * 360,
      duration: Math.random() * 35 + 25, // 25-60 seconds
      delay: Math.random() * 8,
      type: Math.random() > 0.5 ? 'triangle' : 'polygon',
      opacity: Math.random() * 0.05 + 0.03, // 0.03-0.08
    })
  })
  
  return shapes
}

export default function AnimatedBackground() {
  const [shapes, setShapes] = useState<Shape[]>([])
  
  useEffect(() => {
    // Generate shapes on client side to avoid hydration issues
    setShapes(generateShapes())
  }, [])
  
  if (shapes.length === 0) return null
  
  return (
    <div 
      className="absolute inset-0 pointer-events-none" 
      style={{ 
        width: '100vw',
        left: '50%',
        transform: 'translateX(-50%)',
        overflow: 'hidden',
        height: '100%'
      }}
    >
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute"
          initial={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            rotate: shape.rotation,
          }}
          animate={{
            left: [
              `${shape.x}%`,
              `${Math.min(95, shape.x + 20)}%`,
              `${Math.max(0, shape.x - 15)}%`,
              `${Math.min(95, shape.x + 10)}%`,
              `${Math.max(0, shape.x - 10)}%`,
              `${shape.x}%`,
            ],
            top: [
              `${shape.y}%`,
              `${Math.max(0, shape.y - 25)}%`,
              `${Math.min(95, shape.y + 20)}%`,
              `${Math.max(0, shape.y - 10)}%`,
              `${Math.min(95, shape.y + 15)}%`,
              `${shape.y}%`,
            ],
            rotate: [
              shape.rotation,
              shape.rotation + 90,
              shape.rotation + 180,
              shape.rotation + 270,
              shape.rotation + 360,
            ],
            scale: [
              1,
              1.15,
              0.85,
              1.1,
              0.95,
              1,
            ],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: shape.delay,
          }}
          style={{
            width: shape.size,
            height: shape.size,
            zIndex: 0,
          }}
        >
          {shape.type === 'triangle' ? (
            <svg
              width={shape.size}
              height={shape.size}
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50 10 L90 90 L10 90 Z"
                fill="black"
                opacity={shape.opacity}
              />
            </svg>
          ) : (
            <svg
              width={shape.size}
              height={shape.size}
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50 5 L80 30 L80 70 L50 95 L20 70 L20 30 Z"
                fill="black"
                opacity={shape.opacity}
              />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  )
}

