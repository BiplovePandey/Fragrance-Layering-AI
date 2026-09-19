import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, HTMLMotionProps } from 'motion/react';
import { pageViewVariants } from './pageTransitions.js';
import { modalBackdropVariants, modalContentVariants } from './modalTransitions.js';
import { cardInteractiveVariants } from './variants.js';
import { buttonTactileVariants, primaryButtonVariants } from './microInteractions.js';
import { scrollSectionVariants, scrollChildVariants } from './scrollAnimations.js';
import { usePrefersReducedMotion } from './accessibility.js';
import { GPU_ACCELERATED_STYLE } from './performance.js';

/**
 * MotionPage: Top-level view transition wrapper.
 */
export const MotionPage: React.FC<{
  children: React.ReactNode;
  className?: string;
  id?: string;
}> = ({ children, className = '', id }) => {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      id={id}
      variants={reducedMotion ? undefined : pageViewVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`w-full ${className}`}
      style={GPU_ACCELERATED_STYLE}
    >
      {children}
    </motion.div>
  );
};

/**
 * MotionCard: Tactile physical luxury card.
 */
export const MotionCard: React.FC<
  HTMLMotionProps<'div'> & {
    enableTilt?: boolean;
    children: React.ReactNode;
  }
> = ({ children, className = '', enableTilt = false, ...props }) => {
  const reducedMotion = usePrefersReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt || reducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -(y * 4), y: x * 4 });
  };

  const handleMouseLeave = () => {
    if (!enableTilt || reducedMotion) return;
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      variants={reducedMotion ? undefined : cardInteractiveVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={enableTilt ? { rotateX: tilt.x, rotateY: tilt.y } : undefined}
      className={className}
      style={{
        ...GPU_ACCELERATED_STYLE,
        transformStyle: enableTilt ? 'preserve-3d' : undefined,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * MotionButton: Tactile button with physical press feedback.
 */
export const MotionButton: React.FC<
  HTMLMotionProps<'button'> & {
    variant?: 'tactile' | 'primary';
    children: React.ReactNode;
  }
> = ({ children, variant = 'tactile', className = '', ...props }) => {
  const reducedMotion = usePrefersReducedMotion();
  const variants = variant === 'primary' ? primaryButtonVariants : buttonTactileVariants;

  return (
    <motion.button
      variants={reducedMotion ? undefined : variants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={className}
      style={GPU_ACCELERATED_STYLE}
      {...props}
    >
      {children}
    </motion.button>
  );
};

/**
 * MotionModal: Spatial modal with backdrop dim and spring entrance.
 */
export const MotionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  backdropClassName?: string;
  maxWidth?: string;
}> = ({
  isOpen,
  onClose,
  children,
  className = '',
  backdropClassName = '',
  maxWidth = 'max-w-4xl',
}) => {
  const reducedMotion = usePrefersReducedMotion();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Spatial Backdrop */}
          <motion.div
            variants={reducedMotion ? undefined : modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className={`fixed inset-0 bg-[#1A1613]/40 backdrop-blur-xl ${backdropClassName}`}
            style={GPU_ACCELERATED_STYLE}
          />

          {/* Modal Container */}
          <motion.div
            variants={reducedMotion ? undefined : modalContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`relative z-10 w-full ${maxWidth} my-auto ${className}`}
            style={GPU_ACCELERATED_STYLE}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/**
 * MotionReveal: In-view progressive reveal.
 */
export const MotionReveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={scrollSectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className={className}
      style={GPU_ACCELERATED_STYLE}
    >
      {children}
    </motion.div>
  );
};

/**
 * MotionNumber: Animated numerical counter that interpolates smoothly to target values.
 * Perfect for compatibility %, temperature, longevity hours, etc.
 */
export const MotionNumber: React.FC<{
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}> = ({ value, duration = 800, suffix = '', prefix = '', decimals = 0, className = '' }) => {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const startRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const startVal = displayValue;
    const targetVal = value;
    startTimeRef.current = null;

    let animId: number;

    const step = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      // Luxury ease-out curve
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (targetVal - startVal) * eased;
      setDisplayValue(current);

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
};
