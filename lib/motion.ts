// Standardized Framer Motion configuration
// easeInOut timing with 0.4s duration

export const transition = {
  duration: 0.4,
  ease: [0.4, 0, 0.2, 1], // easeInOut
}

export const transitionFast = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1],
}

export const transitionSlow = {
  duration: 0.6,
  ease: [0.4, 0, 0.2, 1],
}

// Standard animation variants
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition,
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition,
  },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition,
  },
}

// Container variants with stagger
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
      ...transition,
    },
  },
}

// Card hover animation
export const cardHover = {
  scale: 1.02,
  transition: transitionFast,
}

// Button hover animation
export const buttonHover = {
  scale: 1.05,
  transition: transitionFast,
}

