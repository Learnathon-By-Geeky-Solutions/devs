'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { TrendingIcon } from '../ui/shared-components';

export interface TrendingItemProps {
  id: string;
  title: string;
  imageSrc?: string;
  count: number;
  type: 'topic' | 'hashtag' | 'location' | 'user';
  onClick?: () => void;
}

export const TrendingItem = ({
  title,
  imageSrc,
  count,
  type,
  onClick
}: TrendingItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ backgroundColor: 'rgba(243, 244, 246, 0.5)' }}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors cursor-pointer"
      onClick={onClick}
    >
      {imageSrc ? (
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative h-10 w-10 rounded-lg overflow-hidden shadow-sm"
        >
          <Image
            src={imageSrc}
            alt={title}
            fill
            style={{ objectFit: 'cover' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </motion.div>
      ) : (
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-100 dark:border-purple-800/30 shadow-sm"
        >
          <TrendingIcon type={type} animate={true} />
        </motion.div>
      )}

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {title}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <span className="font-medium">{count.toLocaleString()}</span>
          <span>{type === 'user' ? 'travelers' : 'posts'}</span>
        </p>
      </div>

      <motion.div
        whileHover={{ x: 2 }}
        className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-50 dark:bg-purple-900/20"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-purple-500 dark:text-purple-400"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
};
