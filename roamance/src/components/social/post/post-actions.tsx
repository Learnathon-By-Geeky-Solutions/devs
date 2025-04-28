'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface PostActionsProps {
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  onLike: () => void;
  onComment: () => void;
  onSave: () => void;
  onShare: () => void;
}

export const PostActions = ({
  likesCount,
  commentsCount,
  isLiked = false,
  isSaved = false,
  onLike,
  onComment,
  onSave,
  onShare
}: PostActionsProps) => {
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [shareTooltip, setShareTooltip] = useState(false);
  const [savedTooltip, setSavedTooltip] = useState(false);

  const handleLikeClick = () => {
    setIsLikeAnimating(true);
    onLike();
    setTimeout(() => setIsLikeAnimating(false), 800);
  };

  const handleShareClick = () => {
    onShare();
    setShareTooltip(true);
    setTimeout(() => setShareTooltip(false), 2000);
  };

  const handleSaveClick = () => {
    onSave();
    setSavedTooltip(true);
    setTimeout(() => setSavedTooltip(false), 2000);
  };

  const handleCommentClick = () => {
    onComment();
  };

  return (
    <div className="px-4 py-3 border-t border-gray-100/50 dark:border-gray-700/30 flex items-center justify-between mt-auto">
      <div className="flex items-center space-x-6">
        {/* Like button with improved animation */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLikeClick}
          className="group flex items-center relative"
        >
          <div className="relative">
            <Heart
              className={cn(
                'h-5 w-5 mr-1.5 transition-all duration-300',
                isLiked
                  ? 'fill-pink-500 text-pink-500 dark:fill-pink-400 dark:text-pink-400'
                  : 'text-gray-400 dark:text-gray-500 group-hover:text-pink-500 dark:group-hover:text-pink-400'
              )}
            />
            <AnimatePresence>
              {isLikeAnimating && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: [0, 0.8, 0] }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Heart className="h-5 w-5 fill-pink-500 text-pink-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.span
            initial={false}
            animate={isLiked ? { scale: [1, 1.2, 1] } : { scale: 1 }}
            transition={{ duration: 0.4 }}
            className={cn(
              'text-sm font-medium transition-colors',
              isLiked
                ? 'text-pink-500 dark:text-pink-400'
                : 'text-gray-500 dark:text-gray-400 group-hover:text-pink-500 dark:group-hover:text-pink-400'
            )}
          >
            {likesCount > 0 ? likesCount.toLocaleString() : 'Like'}
          </motion.span>
        </motion.button>

        {/* Comment button with subtle hover effect */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCommentClick}
          className="group flex items-center"
        >
          <MessageCircle className={cn(
            'h-5 w-5 mr-1.5 transition-colors',
            'text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400'
          )} />
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
            {commentsCount > 0 ? commentsCount.toLocaleString() : 'Comment'}
          </span>
        </motion.button>
      </div>

      <div className="flex items-center space-x-3">
        {/* Save button with animation and tooltip */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSaveClick}
          className="group relative p-2 -my-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
        >
          <AnimatePresence>
            <Bookmark
              className={cn(
                'h-5 w-5 transition-all duration-300',
                isSaved
                  ? 'fill-purple-500 text-purple-500 dark:fill-purple-400 dark:text-purple-400'
                  : 'text-gray-400 dark:text-gray-500 group-hover:text-purple-500 dark:group-hover:text-purple-400'
              )}
            />
            {isSaved && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-purple-100 dark:bg-purple-900/20 rounded-full -z-10"
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {savedTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -top-8 right-0 bg-black/80 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm z-10 shadow-md whitespace-nowrap"
              >
                {isSaved ? 'Saved to collection' : 'Removed from collection'}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Share button with tooltip */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShareClick}
          className="group relative p-2 -my-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
        >
          <Share2 className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />

          <AnimatePresence>
            {shareTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -top-8 right-0 bg-black/80 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm z-10 shadow-md whitespace-nowrap"
              >
                Link copied!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};
