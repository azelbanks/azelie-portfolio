import { Variants, Transition } from 'framer-motion';

// ============================================
// TRANSITIONS
// ============================================

export const springTransition: Transition = {
  type: 'spring',
  stiffness: 100,
  damping: 15,
};

export const smoothTransition: Transition = {
  type: 'tween',
  ease: [0.4, 0, 0.2, 1],
  duration: 0.6,
};

export const fastTransition: Transition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.3,
};

// ============================================
// FADE VARIANTS
// ============================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: smoothTransition,
  },
  exit: { opacity: 0 },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothTransition,
  },
  exit: { opacity: 0, y: 20 },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothTransition,
  },
  exit: { opacity: 0, y: -20 },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: smoothTransition,
  },
  exit: { opacity: 0, x: -30 },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: smoothTransition,
  },
  exit: { opacity: 0, x: 30 },
};

// ============================================
// SCALE VARIANTS
// ============================================

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springTransition,
  },
  exit: { opacity: 0, scale: 0.9 },
};

export const scaleInCenter: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    },
  },
  exit: { opacity: 0, scale: 0 },
};

// ============================================
// STAGGER CONTAINER
// ============================================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

// ============================================
// STAGGER ITEMS
// ============================================

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothTransition,
  },
};

export const staggerItemScale: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springTransition,
  },
};

// ============================================
// TEXT ANIMATIONS
// ============================================

export const letterAnimation: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export const wordAnimation: Variants = {
  hidden: {},
  visible: {},
};

export const textReveal: Variants = {
  hidden: {
    y: '100%',
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.6, 0.01, 0.05, 0.95],
    },
  },
};

// ============================================
// SPECIAL EFFECTS
// ============================================

export const glitchEffect: Variants = {
  idle: { x: 0, opacity: 1 },
  glitch: {
    x: [-2, 2, -2, 2, 0],
    opacity: [1, 0.8, 1, 0.8, 1],
    filter: [
      'hue-rotate(0deg)',
      'hue-rotate(90deg)',
      'hue-rotate(-90deg)',
      'hue-rotate(90deg)',
      'hue-rotate(0deg)',
    ],
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

export const floatAnimation: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const pulseGlow: Variants = {
  initial: {
    boxShadow: '0 0 20px rgba(var(--accent-glow))',
  },
  animate: {
    boxShadow: [
      '0 0 20px rgba(var(--accent-glow))',
      '0 0 40px rgba(var(--accent-glow))',
      '0 0 20px rgba(var(--accent-glow))',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ============================================
// PAGE TRANSITIONS
// ============================================

export const pageTransition: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.6, 0.01, 0.05, 0.95],
      when: 'beforeChildren',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: 'easeInOut',
    },
  },
};

// ============================================
// MODAL / OVERLAY
// ============================================

export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: fastTransition,
  },
};

// ============================================
// HOVER ANIMATIONS (for whileHover)
// ============================================

export const hoverScale = {
  scale: 1.05,
  transition: fastTransition,
};

export const hoverLift = {
  y: -5,
  transition: fastTransition,
};

export const hoverGlow = {
  boxShadow: '0 0 30px var(--accent-glow)',
  transition: fastTransition,
};

// ============================================
// TAP ANIMATIONS (for whileTap)
// ============================================

export const tapScale = {
  scale: 0.95,
};

export const tapPush = {
  scale: 0.98,
  y: 2,
};

// ============================================
// SCROLL-TRIGGERED VARIANTS
// ============================================

export const scrollReveal: Variants = {
  offscreen: {
    y: 80,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      bounce: 0.3,
      duration: 0.8,
    },
  },
};

export const scrollRevealLeft: Variants = {
  offscreen: {
    x: -100,
    opacity: 0,
  },
  onscreen: {
    x: 0,
    opacity: 1,
    transition: smoothTransition,
  },
};

export const scrollRevealRight: Variants = {
  offscreen: {
    x: 100,
    opacity: 0,
  },
  onscreen: {
    x: 0,
    opacity: 1,
    transition: smoothTransition,
  },
};

// ============================================
// MODE SWITCH ANIMATION
// ============================================

export const modeSwitch: Variants = {
  strategist: {
    rotate: 0,
    scale: 1,
  },
  tech: {
    rotate: 180,
    scale: 1,
  },
};

export const contentMorph: Variants = {
  initial: {
    opacity: 0,
    filter: 'blur(10px)',
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    filter: 'blur(10px)',
    scale: 0.95,
    transition: {
      duration: 0.3,
    },
  },
};
