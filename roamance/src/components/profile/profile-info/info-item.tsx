import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';

// Color utility functions to fix Tailwind class name issues
const getBackgroundColorClass = (
  color: 'ocean' | 'sunset' | 'forest' | 'sand' | 'mountain'
) => {
  const classMap = {
    ocean: 'bg-ocean/10',
    sunset: 'bg-sunset/10',
    forest: 'bg-forest/10',
    sand: 'bg-sand/10',
    mountain: 'bg-mountain/10',
  };
  return classMap[color];
};

const getTextColorClass = (
  color: 'ocean' | 'sunset' | 'forest' | 'sand' | 'mountain'
) => {
  const classMap = {
    ocean: 'text-ocean',
    sunset: 'text-sunset',
    forest: 'text-forest',
    sand: 'text-sand',
    mountain: 'text-mountain',
  };
  return classMap[color];
};

const getHoverColorClass = (
  color: 'ocean' | 'sunset' | 'forest' | 'sand' | 'mountain'
) => {
  const classMap = {
    ocean: 'hover:text-ocean-dark',
    sunset: 'hover:text-sunset-dark',
    forest: 'hover:text-forest-dark',
    sand: 'hover:text-sand-dark',
    mountain: 'hover:text-mountain-dark',
  };
  return classMap[color];
};

const getBorderColorClass = (
  color: 'ocean' | 'sunset' | 'forest' | 'sand' | 'mountain'
) => {
  const classMap = {
    ocean: 'border-ocean/30',
    sunset: 'border-sunset/30',
    forest: 'border-forest/30',
    sand: 'border-sand/30',
    mountain: 'border-mountain/30',
  };
  return classMap[color];
};

export interface InfoItemProps {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  value?: string;
  color: 'ocean' | 'sunset' | 'forest' | 'sand' | 'mountain';
  isLink?: boolean;
  fallback?: string;
}

export function InfoItem({
  icon: Icon,
  label,
  value,
  color,
  isLink,
  fallback = 'Not available',
}: InfoItemProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border',
        getBorderColorClass(color),
        'bg-gradient-to-b from-background to-background/50 backdrop-blur-sm'
      )}
    >
      <div className={cn('p-2 rounded-full', getBackgroundColorClass(color))}>
        <Icon className={cn('h-4 w-4', getTextColorClass(color))} />
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-1 font-medium">
          {label}
        </p>

        {isLink && value ? (
          <a
            href={value.startsWith('http') ? value : `https://${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'text-sm font-medium underline',
              getTextColorClass(color),
              getHoverColorClass(color)
            )}
          >
            {value}
          </a>
        ) : (
          <p className="text-sm font-medium">{value || fallback}</p>
        )}
      </div>
    </motion.div>
  );
}
