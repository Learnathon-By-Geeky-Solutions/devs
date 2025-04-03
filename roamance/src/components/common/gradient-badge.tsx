import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GradientBadgeProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  delay?: number;
}

export function GradientBadge({
  children,
  className,
  gradient = 'bg-primary/10',
  delay = 0.3,
}: GradientBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.8 }}
      className={cn(
        'inline-block px-3 py-1 rounded-full text-primary text-sm font-medium',
        gradient,
        className
      )}
    >
      {children}
    </motion.div>
  );
}
