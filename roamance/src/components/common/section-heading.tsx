import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: React.ReactNode;
  subtitle: string;
  alignment?: 'left' | 'center' | 'right';
  className?: string;
  subtitleClassName?: string;
  titleHighlight?: string;
}

export function SectionHeading({
  title,
  subtitle,
  alignment = 'center',
  className,
  subtitleClassName,
  titleHighlight,
}: SectionHeadingProps) {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const processTitle = (title: React.ReactNode): React.ReactNode => {
    if (typeof title !== 'string' || !titleHighlight) return title;

    return title.split(titleHighlight).map((part, index, array) => {
      if (index === array.length - 1) return part;
      return (
        <React.Fragment key={index}>
          {part}
          <span className="text-primary">{titleHighlight}</span>
        </React.Fragment>
      );
    });
  };

  return (
    <div className={cn('mb-10', alignmentClasses[alignment], className)}>
      <motion.h2
        className="text-3xl md:text-4xl font-bold mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {processTitle(title)}
      </motion.h2>
      <motion.p
        className={cn(
          'text-muted-foreground max-w-2xl mx-auto text-lg',
          subtitleClassName
        )}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {subtitle}
      </motion.p>
    </div>
  );
}
