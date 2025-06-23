import { Variants } from "framer-motion"

// Container animations for staggered children
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
}

// File item entrance/exit animations
export const fileItemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: -20,
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 24 
    }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    scale: 0.95,
    transition: { 
      duration: 0.2,
      ease: "easeInOut"
    }
  }
}

// Button interaction animations
export const buttonVariants: Variants = {
  idle: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -1,
    transition: { duration: 0.15 }
  },
  tap: { 
    scale: 0.98, 
    y: 0,
    transition: { duration: 0.1 }
  }
}

// Drop zone animations
export const dropZoneVariants: Variants = {
  idle: { 
    scale: 1,
    borderColor: "rgb(209 213 219)", // gray-300
  },
  dragOver: { 
    scale: 1.02,
    borderColor: "rgb(59 130 246)", // blue-500
    backgroundColor: "rgb(239 246 255)", // blue-50
    transition: { duration: 0.2 }
  }
}

// Progress bar animation
export const progressVariants: Variants = {
  hidden: { width: "0%" },
  visible: (progress: number) => ({
    width: `${progress}%`,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  })
}

// Card hover animations
export const cardVariants: Variants = {
  idle: { 
    scale: 1, 
    y: 0,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)"
  },
  hover: { 
    scale: 1.02, 
    y: -2,
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
    transition: { duration: 0.2 }
  }
}

// Page transition animations
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
}

// Stagger animation for lists
export const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    }
  }
}