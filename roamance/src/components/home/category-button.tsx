import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CategoryButtonProps {
  category: string;
  activeCategory: string;
  onClick: (category: string) => void;
  index?: number;
}

export function CategoryButton({
  category,
  activeCategory,
  onClick,
  index = 0,
}: CategoryButtonProps) {
  return (
    <motion.button
      key={category}
      className={cn(
        'px-4 py-2 rounded-full text-sm font-medium transition-all',
        activeCategory === category
          ? 'bg-primary text-white'
          : 'bg-background hover:bg-muted'
      )}
      onClick={() => onClick(category)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: 0.05 * index }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      {category}
    </motion.button>
  );
}
