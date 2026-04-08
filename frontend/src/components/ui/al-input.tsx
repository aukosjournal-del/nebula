import React from 'react';
import { motion } from 'framer-motion';

interface ALInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
  variant?: 'outline' | 'minimal';
  className?: string;
}

/**
 * AL Input
 * Atmospheric Logic input component
 *
 * Design:
 * - Minimalist bottom border only (Slite DNA)
 * - Focus state with accent color (Cyan) (Ready DNA)
 * - Smooth transitions with fluid easing
 * - Optional label, error, and helper text
 */
export const ALInput = React.forwardRef<HTMLInputElement, ALInputProps>(
  (
    {
      label,
      error,
      helper,
      icon,
      variant = 'minimal',
      className = '',
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const variantClasses = {
      outline: `
        border border-gray-200
        rounded-lg
        px-4 py-2.5
        bg-white bg-opacity-80
      `,
      minimal: `
        border-b-2 border-gray-200
        px-0 py-2.5
        bg-transparent
      `,
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}

          <motion.input
            ref={ref}
            className={`
              w-full
              text-base
              text-gray-900
              placeholder-gray-400
              transition-all duration-300
              ${variantClasses[variant]}
              ${icon ? 'pl-10' : ''}
              focus:outline-none
              ${isFocused
                ? variant === 'minimal'
                  ? 'border-b-2 border-cyan-500 shadow-none'
                  : 'border-cyan-500 shadow-al-glow'
                : ''}
              ${error ? 'border-red-500' : ''}
              ${className}
            `}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />

          {/* Focus glow effect */}
          {isFocused && variant === 'outline' && (
            <motion.div
              className="
                absolute inset-0
                rounded-lg
                bg-gradient-to-r from-cyan-400 to-cyan-500
                opacity-10
                pointer-events-none
              "
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </div>

        {/* Error message */}
        {error && (
          <motion.p
            className="text-sm text-red-500 mt-2"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}

        {/* Helper text */}
        {helper && !error && (
          <p className="text-sm text-gray-500 mt-2">
            {helper}
          </p>
        )}
      </div>
    );
  }
);

ALInput.displayName = 'ALInput';
