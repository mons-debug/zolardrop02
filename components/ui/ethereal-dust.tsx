'use client'

import React, { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface EtherealDustProps {
  className?: string
  containerClassName?: string
  particleCount?: number
  particleColor?: string
  particleOpacity?: number
}

export const EtherealDust = ({
  className,
  containerClassName,
  particleCount = 20,
  particleColor = '#000000',
  particleOpacity = 0.03
}: EtherealDustProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 80 + 40 // Size between 40-120
        this.speedX = (Math.random() - 0.5) * 0.3 // Very slow horizontal movement
        this.speedY = (Math.random() - 0.5) * 0.3 // Very slow vertical movement
        this.opacity = Math.random() * particleOpacity
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Wrap around edges
        if (this.x > canvas.width + this.size) this.x = -this.size
        if (this.x < -this.size) this.x = canvas.width + this.size
        if (this.y > canvas.height + this.size) this.y = -this.size
        if (this.y < -this.size) this.y = canvas.height + this.size
      }

      draw() {
        if (!ctx) return
        
        // Create radial gradient for soft shadow effect
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size
        )
        
        gradient.addColorStop(0, `${particleColor}${Math.floor(this.opacity * 255).toString(16).padStart(2, '0')}`)
        gradient.addColorStop(1, `${particleColor}00`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create particles
    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [particleCount, particleColor, particleOpacity])

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', containerClassName)}>
      <canvas
        ref={canvasRef}
        className={cn('w-full h-full', className)}
        style={{ 
          pointerEvents: 'none',
          mixBlendMode: 'normal', // Changed from multiply for better visibility
          opacity: 0.5 // Added overall opacity control
        }}
      />
    </div>
  )
}

