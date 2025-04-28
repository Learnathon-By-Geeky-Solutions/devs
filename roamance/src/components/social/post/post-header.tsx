'use client';

import { User } from '@/types';
import { formatTimestamp } from '@/utils';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export interface PostHeaderProps {
  user: User;
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
  };
}

export const PostHeader = ({ user, timestamp, location }: PostHeaderProps) => {
  return (
    <div className="flex items-center space-x-3">
      <Link href={`/profile/${user.id}`} className="group">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative h-11 w-11 rounded-full overflow-hidden ring-2 ring-gradient-to-r from-purple-200 to-indigo-200 dark:from-purple-700/60 dark:to-indigo-700/60 ring-offset-1 ring-offset-white dark:ring-offset-gray-800 shadow-sm"
        >
          <Image
            src={user.profile_image || '/images/roamance-logo-no-text.png'}
            alt={user.name || 'User'}
            fill
            style={{ objectFit: 'cover' }}
            sizes="44px"
            className="rounded-full transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-black/0 group-hover:from-purple-500/20 group-hover:to-blue-500/10 transition-colors duration-500 rounded-full"></div>
        </motion.div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          href={`/profile/${user.id}`}
          className="text-[15px] font-semibold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors group inline-flex items-center gap-1.5 flex-wrap"
        >
          <span className="truncate">{user.name || 'Anonymous'}</span>
          {/* {user.is_verified && (
            <motion.div
              whileHover={{ rotate: 20 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="bg-blue-100 dark:bg-blue-900/30 p-0.5 rounded-full inline-flex"
            >
              <BadgeCheck className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
            </motion.div>
          )} */}
          {/* {user.role === 'TRAVEL_EXPERT' && (
            <motion.span
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
              className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-600 dark:text-amber-400 border border-amber-100/50 dark:border-amber-800/30"
            >
              Expert
            </motion.span>
          )} */}
        </Link>

        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-0.5 space-x-2 flex-wrap">
          {location && location.name && (
            <motion.div
              whileHover={{ y: -1 }}
              className="flex items-center hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
            >
              <MapPin className="h-3 w-3 mr-1 text-pink-500 dark:text-pink-400" />
              <span className="truncate max-w-[120px]">
                {location.name}
              </span>
            </motion.div>
          )}
          <span className="text-[10px] bg-gray-100/70 dark:bg-gray-700/50 px-1.5 py-0.5 rounded-full whitespace-nowrap">
            {formatTimestamp(timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
};
