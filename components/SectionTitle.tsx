'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface SectionTitleProps {
  children: ReactNode
  subtitle?: string
  align?: 'left' | 'center' | 'right'
  className?: string
  animate?: boolean
}

export default function SectionTitle({
  children,
  subtitle,
  align = 'center',
  className = '',
  animate = true,
}: SectionTitleProps) {
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  }

  const lineVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: {
      width: '100%',
      opacity: 1,
      transition: {
        duration: 1,
        delay: 0.3,
        ease: 'easeInOut',
      },
    },
  }

  const ContentWrapper = animate ? motion.div : 'div'
  const LineWrapper = animate ? motion.div : 'div'

  return (
    <ContentWrapper
      className={`flex flex-col ${alignmentClasses[align]} ${className}`}
      {...(animate
        ? {
            initial: 'hidden',
            whileInView: 'visible',
            viewport: { once: true, margin: '-100px' },
            variants: containerVariants,
          }
        : {})}
    >
      {/* Main Title */}
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 relative inline-block">
        <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          {children}
        </span>
      </h2>

      {/* Animated Line */}
      <LineWrapper
        className={`h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 rounded-full mb-6 ${
          align === 'center' ? 'max-w-xs mx-auto' : align === 'right' ? 'ml-auto max-w-xs' : 'max-w-xs'
        }`}
        {...(animate
          ? {
              initial: 'hidden',
              whileInView: 'visible',
              viewport: { once: true, margin: '-100px' },
              variants: lineVariants,
            }
          : { style: { width: '100%' } })}
      />

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          className="text-gray-500 text-lg max-w-2xl"
          {...(animate
            ? {
                initial: { opacity: 0 },
                whileInView: { opacity: 1 },
                viewport: { once: true },
                transition: { duration: 0.8, delay: 0.5 },
              }
            : {})}
        >
          {subtitle}
        </motion.p>
      )}

      {/* Decorative Dots */}
      <div className="flex space-x-2 mt-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
            {...(animate
              ? {
                  initial: { scale: 0, opacity: 0 },
                  whileInView: { scale: 1, opacity: 1 },
                  viewport: { once: true },
                  transition: {
                    duration: 0.4,
                    delay: 0.6 + i * 0.1,
                    ease: 'backOut',
                  },
                }
              : {})}
          />
        ))}
      </div>
    </ContentWrapper>
  )
}

