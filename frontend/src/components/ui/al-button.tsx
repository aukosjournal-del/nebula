import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ALButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  glowEffect?: boolean;
  className?: string;
}

/**
 * AL Button
 * Atmospheric Logic button component
 *
 * Design:
 * - Pill-shaped form (Slite DNA)
 * - Subtle scale on hover (1.02x)
 * - Optional glow effect (Ready DNA)
 * - Smooth transitions with fluid easing
 */
export const ALButton = React.forwardRef<
  HTMLButtonElement,
  ALButtonProps
>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      glowEffect = true,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-2.5 text-base',
      lg: 'px-8 py-3 text-lg',
    };

    const variantClasses = {
      primary: `
        bg-gradient-to-r from-cyan-500 to-cyan-600
        text-white
        hover:from-cyan-600 hover:to-cyan-700
        ${glowEffect ? 'shadow-lg' : ''}
      `,
      secondary: `
        bg-muted/20
        text-foreground
        hover:bg-muted/40
        border border-border
      `,
      ghost: `
        bg-transparent
        text-primary
        hover:bg-primary/10
      `,
      danger: `
        bg-red-500
        text-white
        hover:bg-red-600
      `,
    };

    return (
      <motion.button
        ref={ref}
        className={`
          relative
          rounded-full
          font-medium
          transition-all
          duration-300
          ease-in-out
          disabled:opacity-50 disabled:cursor-not-allowed
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${className}
        `}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Glow effect overlay */}
        {glowEffect && variant === 'primary' && (
          <div
            className="
              absolute inset-0
              rounded-full
              bg-gradient-to-r from-cyan-400 to-cyan-500
              opacity-0
              group-hover:opacity-20
              blur-lg
              -z-10
            "
            aria-hidden="true"
          />
        )}

        {/* Button content */}
        <span className="flex items-center gap-2">
          {isLoading && (
            <motion.div
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}
          {children}
        </span>
      </motion.button>
    );
  }
);

ALButton.displayName = 'ALButton';
