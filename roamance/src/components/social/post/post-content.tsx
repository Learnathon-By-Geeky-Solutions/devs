'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { User } from '@/types';
import { formatTimestamp } from '@/utils';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, Calendar } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export interface PostContentProps {
  text: string;
  tidbits?: string;
  user: User;
  timestamp: string;
  location?: string;
}

export const PostContent = ({
  text,
  tidbits,
  user,
  timestamp,
  location
}: PostContentProps) => {
  const [showAll, setShowAll] = useState(false);
  const EMPTY_TIDBITS = 'Nothing to show';

  // Check if text is long enough to need truncation
  const isLongText = text.length > 280;
  const displayText = showAll ? text : (isLongText ? `${text.substring(0, 280)}...` : text);

  return (
    <div className="px-4 pb-4">
      {/* Post text content with improved typography */}
      <div className="text-gray-800 dark:text-gray-200 leading-relaxed text-[15px] tracking-wide">
        <p className="whitespace-pre-line">
          {displayText}
          {isLongText && !showAll && (
            <motion.button
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAll(true)}
              className="ml-1 text-purple-600 dark:text-purple-400 font-medium hover:underline focus:outline-none"
            >
              Read more
            </motion.button>
          )}
          {isLongText && showAll && (
            <motion.button
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAll(false)}
              className="ml-1 text-purple-600 dark:text-purple-400 font-medium hover:underline focus:outline-none block mt-2"
            >
              Show less
            </motion.button>
          )}
        </p>

        {/* Location and date information */}
        {(location || timestamp) && (
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500 dark:text-gray-400">
            {location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{location}</span>
              </div>
            )}
            {timestamp && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatTimestamp(timestamp)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Travel Insights Feature */}
      {tidbits && tidbits.length > 0 && tidbits !== EMPTY_TIDBITS && (
        <div className="mt-4 hidden md:block">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl bg-gradient-to-r from-amber-50/90 to-yellow-50/90 dark:from-amber-900/15 dark:to-yellow-900/15 p-4 border border-amber-100/70 dark:border-amber-800/30"
          >
            <h4 className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2 flex items-center">
              <span className="relative mr-2">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatType: 'reverse',
                    duration: 2,
                  }}
                  className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 rounded-full blur-sm"
                />
                <Sparkles className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 relative" />
              </span>
              Traveler Insights
            </h4>

            <div className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
              <p className="line-clamp-2">{tidbits}</p>

              <Popover>
                <PopoverTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-2 text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline focus:outline-none"
                  >
                    Read full insights
                  </motion.button>
                </PopoverTrigger>
                <PopoverContent className="w-[350px] p-5 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg shadow-xl border border-amber-100 dark:border-amber-800/30 rounded-xl">
                  <div>
                    <h3 className="text-base font-semibold bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-400 dark:to-yellow-400 bg-clip-text text-transparent flex items-center mb-3">
                      <Sparkles className="h-4 w-4 mr-2 text-amber-500" />
                      Travel Insights & Tips
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                      {tidbits}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                    <div className="flex items-center">
                      <Image
                        src={user.profile_image || '/images/roamance-logo-no-text.png'}
                        alt={user.name || 'User'}
                        width={24}
                        height={24}
                        className="rounded-full mr-2 border border-white dark:border-gray-800"
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">
                          {user.name || 'Anonymous'}
                        </span>
                        • {formatTimestamp(timestamp)}
                      </span>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
