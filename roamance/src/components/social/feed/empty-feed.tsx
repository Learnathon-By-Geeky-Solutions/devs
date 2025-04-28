'use client';

import { Sparkles, MapPin, Camera, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export const EmptyFeed = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }}
      className="text-center py-14 px-8 rounded-3xl bg-gradient-to-r from-purple-50/90 via-indigo-50/90 to-blue-50/90 dark:from-purple-950/30 dark:via-indigo-950/30 dark:to-blue-950/30 border border-purple-100/80 dark:border-purple-800/30 shadow-sm backdrop-blur-sm"
    >
      <div className="max-w-md mx-auto">
        <div className="relative">
          <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-md mb-6 backdrop-blur-sm">
            <Sparkles className="h-10 w-10 text-purple-500 dark:text-purple-400" />
          </div>

          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -60, y: -20 }}
            animate={{ opacity: 1, scale: 1, x: -60, y: -20 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute hidden md:block"
          >
            <div className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-sm backdrop-blur-sm">
              <MapPin className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 60, y: -30 }}
            animate={{ opacity: 1, scale: 1, x: 60, y: -30 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute hidden md:block"
          >
            <div className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-sm backdrop-blur-sm">
              <Camera className="h-5 w-5 text-pink-500 dark:text-pink-400" />
            </div>
          </motion.div>
        </div>

        <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">Share Your Journey</h3>

        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6 leading-relaxed">
          Be the first to share your travel moments and inspire fellow adventurers around the world. Your stories can spark someone else&apos;s next great adventure!
        </p>

        <div className="space-y-3">
          <Link href="/social/create" passHref>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center mx-auto"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Create Your First Post
            </motion.button>
          </Link>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-gray-500 dark:text-gray-500 mt-4"
          >
            Your adventures deserve to be shared
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};
