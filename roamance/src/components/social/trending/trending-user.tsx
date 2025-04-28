'use client';

import { User } from '@/types';
import { motion } from 'framer-motion';
import { UserAvatar } from '../ui/shared-components';
import { PlusIcon } from 'lucide-react';

export interface TrendingUserProps {
  user: User;
  onClick?: () => void;
}

export const TrendingUser = ({ user, onClick }: TrendingUserProps) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="flex flex-col items-center gap-1 p-2 cursor-pointer group relative"
      onClick={onClick}
    >
      <div className="relative">
        <UserAvatar
          user={user}
          size="md"
          showBorder
          className="h-14 w-14 group-hover:border-purple-300 dark:group-hover:border-purple-700 transition-colors"
        />

        {/* Follow button overlay on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="bg-white dark:bg-gray-800 rounded-full p-1 shadow-md">
            <PlusIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
        </motion.div>
      </div>

      <div className="text-center">
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors text-center truncate max-w-[60px] block">
          {user.name || user.email?.split('@')[0]}
        </span>

        {/* Show "Follow" text on hover */}
        <motion.span
          initial={{ opacity: 0, height: 0 }}
          whileHover={{ opacity: 1, height: 'auto' }}
          className="text-[10px] text-purple-500 dark:text-purple-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Follow
        </motion.span>
      </div>
    </motion.div>
  );
};
