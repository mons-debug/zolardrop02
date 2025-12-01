'use client'

import { useEffect, useMemo, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { type Container, type ISourceOptions } from '@tsparticles/engine'
import { loadSlim } from '@tsparticles/slim'

interface SparklesProps {
  id?: string
  className?: string
  background?: string
  minSize?: number
  maxSize?: number
  speed?: number
  particleColor?: string
  particleDensity?: number
}

export const Sparkles = ({
  id = 'tsparticles',
  className = '',
  background = 'transparent',
  minSize = 1,
  maxSize = 3,
  speed = 4,
  particleColor = '#000000',
  particleDensity = 120
}: SparklesProps) => {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  const particlesLoaded = async (container?: Container): Promise<void> => {
    // Particles loaded callback
  }

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: background
        }
      },
      fullScreen: {
        enable: false,
        zIndex: 0
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: 'push'
          },
          onHover: {
            enable: false
          },
          resize: {
            enable: true,
            delay: 0.5
          } as any
        },
        modes: {
          push: {
            quantity: 4
          }
        }
      },
      particles: {
        color: {
          value: particleColor
        },
        move: {
          enable: false
        },
        number: {
          density: {
            enable: true,
            width: 400,
            height: 400
          } as any,
          value: particleDensity
        },
        opacity: {
          value: {
            min: 0.3,
            max: 1
          },
          animation: {
            enable: true,
            speed: speed,
            sync: false
          }
        },
        shape: {
          type: 'circle'
        },
        size: {
          value: {
            min: minSize,
            max: maxSize
          }
        }
      },
      detectRetina: true
    }),
    [background, minSize, maxSize, speed, particleColor, particleDensity]
  )

  if (init) {
    return (
      <Particles
        id={id}
        className={className}
        particlesLoaded={particlesLoaded}
        options={options}
      />
    )
  }

  return null
}
