import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router';
import { styled } from '@mui/material/styles';
import { usePreferencesStore } from '@/store';
import type { ThemeTransition } from '@/types/settings';

// ----------------------------------------------------------------------

type TransitionVariant = {
  initial: Record<string, number>;
  animate: Record<string, number>;
  exit: Record<string, number>;
};

const transitionVariants: Record<ThemeTransition, TransitionVariant> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  'fade-slide': {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  },
  'fade-up': {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  },
  'fade-down': {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 30 },
  },
  'fade-zoom': {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
  },
};

const transitionConfig = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1] as const, // Material Design easing
};

const MotionRoot = styled(motion.div)({
  width: '100%',
  height: '100%',
});

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function PageTransition({ children }: Props) {
  const location = useLocation();
  const transitionEnabled = usePreferencesStore((state) => state.transitionEnabled);
  const themeTransition = usePreferencesStore((state) => state.themeTransition);

  // If transition is disabled, render children directly
  if (!transitionEnabled) {
    return <>{children}</>;
  }

  const variants = transitionVariants[themeTransition];

  return (
    <AnimatePresence mode="wait" initial={false}>
      <MotionRoot
        key={location.pathname}
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
        transition={transitionConfig}
      >
        {children}
      </MotionRoot>
    </AnimatePresence>
  );
}
