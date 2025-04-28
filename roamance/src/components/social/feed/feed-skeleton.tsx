'use client';

import { motion } from 'framer-motion';

export const FeedSkeleton = () => {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/30 p-4 shadow-sm backdrop-blur-sm"
        >
          <div className="animate-pulse">
            {/* Post header skeleton */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-11 w-11 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full"></div>
                <div className="h-3 w-1/4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full"></div>
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"></div>
            </div>

            {/* Post content skeleton */}
            <div className="space-y-3 mb-4">
              <div className="h-4 w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full"></div>
              <div className="h-4 w-5/6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full"></div>
              <div className="h-4 w-4/6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full"></div>
            </div>

            {/* Post image skeleton */}
            <div className="h-64 w-full mb-4 rounded-xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 overflow-hidden relative">
              <div className="absolute inset-0 bg-shimmer-gradient animate-shimmer"></div>
            </div>

            {/* Post actions skeleton */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700/30">
              <div className="flex space-x-4">
                <div className="h-8 w-14 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full"></div>
                <div className="h-8 w-14 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full"></div>
                <div className="h-8 w-14 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full"></div>
              </div>
              <div className="h-8 w-14 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export const PostCardSkeleton = () => {
  return (
    <div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/30 p-4 shadow-sm backdrop-blur-sm">
      <div className="animate-pulse">
        {/* Post header skeleton */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full"></div>
            <div className="h-3 w-1/4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full"></div>
          </div>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"></div>
        </div>

        {/* Post content skeleton */}
        <div className="space-y-3 mb-4">
          <div className="h-4 w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full"></div>
          <div className="h-4 w-5/6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full"></div>
          <div className="h-4 w-4/6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full"></div>
        </div>

        {/* Post image skeleton */}
        <div className="h-64 w-full mb-4 rounded-xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 overflow-hidden relative">
          <div className="absolute inset-0 bg-shimmer-gradient animate-shimmer"></div>
        </div>

        {/* Post actions skeleton */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700/30">
          <div className="flex space-x-4">
            <div className="h-8 w-14 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full"></div>
            <div className="h-8 w-14 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full"></div>
            <div className="h-8 w-14 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full"></div>
          </div>
          <div className="h-8 w-14 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
