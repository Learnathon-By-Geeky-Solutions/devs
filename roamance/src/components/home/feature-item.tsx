import React, { ReactElement } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { IconWrapper } from '../common/icon-wrapper';

interface FeatureItemProps {
  icon: LucideIcon | ReactElement;
  title: string;
  description: string;
  colorClass?: string;
  bgColorClass?: string;
  className?: string;
  delay?: number;
  index?: number;
}

export function FeatureItem({
  icon,
  title,
  description,
  colorClass = 'text-primary',
  bgColorClass = 'bg-primary/20',
  className,
  delay = 0,
  index = 0,
}: FeatureItemProps) {
  return (
    <motion.div
      className={cn(
        'bg-background rounded-xl p-6 border hover:shadow-lg transition-all',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay || 0.1 * (index + 1) }}
      whileHover={{ y: -5 }}
    >
      <IconWrapper
        icon={icon}
        colorClass={colorClass}
        bgColorClass={bgColorClass}
        className="mb-4"
      />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
}
