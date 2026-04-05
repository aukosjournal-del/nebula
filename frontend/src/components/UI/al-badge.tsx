import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ALBadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles = {
  default: 'bg-gray-100 text-gray-700 border-gray-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  error: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-cyan-50 text-cyan-700 border-cyan-200',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export const ALBadge = React.forwardRef<HTMLSpanElement, ALBadgeProps>(
  ({ children, variant = 'default', size = 'sm', className = '' }, ref) => (
    <motion.span
      ref={ref}
      whileHover={{ scale: 1.05 }}
      className={`
        inline-flex items-center
        rounded-full
        border
        font-medium
        transition-shadow duration-300
        hover:shadow-sm
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </motion.span>
  )
);

ALBadge.displayName = 'ALBadge';
