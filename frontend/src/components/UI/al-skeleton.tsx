import React from 'react';
import { motion } from 'framer-motion';

interface ALSkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  className?: string;
}

export const ALSkeleton = React.forwardRef<HTMLDivElement, ALSkeletonProps>(
  ({ width = '100%', height = '16px', rounded = false, className = '' }, ref) => (
    <motion.div
      ref={ref}
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      className={`
        bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200
        ${rounded ? 'rounded-full' : 'rounded-lg'}
        ${className}
      `}
      style={{ width, height }}
    />
  )
);

ALSkeleton.displayName = 'ALSkeleton';
