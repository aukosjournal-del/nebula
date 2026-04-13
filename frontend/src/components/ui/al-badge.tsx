import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ALBadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles = {
  default: 'bg-muted/20 text-foreground/70 border-border/40',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  error: 'bg-red-500/10 text-red-400 border-red-500/30',
  info: 'bg-primary/10 text-primary border-primary/30',
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
