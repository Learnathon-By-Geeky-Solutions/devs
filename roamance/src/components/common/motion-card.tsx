import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MotionCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: 'lift' | 'scale' | 'none';
  initialAnimation?: {
    opacity?: number;
    y?: number;
    x?: number;
    scale?: number;
  };
  animateAnimation?: {
    opacity?: number;
    y?: number;
    x?: number;
    scale?: number;
  };
  delay?: number;
  duration?: number;
  onClick?: () => void;
}

export function MotionCard({
  children,
  className,
  hoverEffect = 'none',
  initialAnimation = { opacity: 0, y: 20 },
  animateAnimation = { opacity: 1, y: 0 },
  delay = 0,
  duration = 0.5,
  onClick,
}: MotionCardProps) {
  const getHoverAnimation = () => {
    switch (hoverEffect) {
      case 'lift':
        return { y: -5 };
      case 'scale':
        return { scale: 1.05 };
      default:
        return {};
    }
  };

  return (
    <motion.div
      className={cn(
        'bg-background rounded-xl border hover:shadow-md transition-shadow',
        className
      )}
      initial={initialAnimation}
      whileInView={{ ...animateAnimation }}
      viewport={{ once: true }}
      transition={{ duration, delay }}
      whileHover={getHoverAnimation()}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
