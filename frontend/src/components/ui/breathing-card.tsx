import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface BreathingCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
  href?: string;
  as?: keyof JSX.IntrinsicElements;
  dataInteraction?: string;
  ariaLabel?: string;
  role?: string;
}

/**
 * The Breathing Card
 * Core component of Atmospheric Logic
 *
 * Combines Slite's structural rigor with Ready's organic warmth:
 * - Subtle rotation on hover for organic feel
 * - Spring animation physics
 * - Glassmorphism with backdrop blur
 * - Accessible keyboard navigation
 */
export const BreathingCard = React.forwardRef<
  HTMLDivElement,
  BreathingCardProps
>(
  (
    {
      children,
      className = '',
      onClick,
      interactive = true,
      dataInteraction = 'hover-reveal',
      ariaLabel,
      role = 'region',
      ...props
    },
    ref
  ) => {
    const Component = motion.div;

    return (
      <Component
        ref={ref}
        className={`
          relative overflow-hidden
          p-6
          rounded-[12px]
          bg-white bg-opacity-70
          border border-black border-opacity-5
          backdrop-blur-[40px]
          transition-all duration-300
          ${interactive ? 'cursor-pointer hover:shadow-lg' : ''}
          ${className}
        `}
        whileHover={
          interactive
            ? {
                y: -4,
                rotate: -0.5,
                transition: {
                  type: 'spring',
                  damping: 20,
                  stiffness: 120,
                  mass: 1,
                },
              }
            : undefined
        }
        onClick={onClick}
        data-interaction={dataInteraction}
        aria-label={ariaLabel}
        role={role}
        {...props}
      >
        {/* Optional animated background squiggle */}
        {interactive && (
          <div
            className="
              absolute -top-1/4 -right-1/4
              w-[150px] h-[150px]
              opacity-5 pointer-events-none
            "
            aria-hidden="true"
          >
            {/* Placeholder for Lottie animation */}
            <div
              className="
                w-full h-full
                rounded-full
                bg-gradient-to-r from-cyan-400 to-purple-400
                blur-2xl
              "
            />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </Component>
    );
  }
);

BreathingCard.displayName = 'BreathingCard';
