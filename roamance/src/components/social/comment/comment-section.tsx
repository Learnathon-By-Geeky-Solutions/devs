'use client';

import { CommentCard } from '@/components/social/comment/comment-card';
import { useSocialContext } from '@/context/SocialContext';
import { Comment, CommentResponseDto, User } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, MessageSquarePlus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { CommentForm } from './comment-form';

interface CommentSectionProps {
  postId: string;
  currentUser?: User;
  initialComments?: Comment[];
}

export const CommentSection = ({
  postId,
  currentUser,
  initialComments = [],
}: CommentSectionProps) => {
  const { fetchComments, createComment, isCommentsLoading, isCreatingComment, error } = useSocialContext();
  const [comments, setComments] = useState<CommentResponseDto[]>(initialComments);

  // Fetch comments when needed
  const loadComments = useCallback(async () => {
    if (!initialComments.length) {
      const fetchedComments = await fetchComments(postId);
      setComments(fetchedComments);
    }
  }, [fetchComments, initialComments, postId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmitComment = async (
    text: string,
    imagePath?: string,
    videoPath?: string
  ) => {
    const commentData = {
      text,
      image_path: imagePath || '',
      video_path: videoPath || '',
    };

    const newComment = await createComment(postId, commentData);

    if (newComment) {
      // Add the new comment to the local state
      setComments((prevComments) => [newComment, ...prevComments]);
    }
  };

  // Animation variants for staggered animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="w-full">
      {/* Comment form */}
      <div className="mb-6">
        <CommentForm
          onSubmit={handleSubmitComment}
          currentUser={currentUser}
          isSubmitting={isCreatingComment}
        />
      </div>

      {/* Comments count */}
      {!isCommentsLoading && (
        <div className="flex items-center gap-2 mb-5">
          <h3 className="text-sm font-medium bg-gradient-ocean text-transparent bg-clip-text">
            {comments.length > 0
              ? `${comments.length} Comment${comments.length === 1 ? '' : 's'}`
              : 'No comments yet'}
          </h3>
        </div>
      )}

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="p-4 mb-5 rounded-xl bg-gradient-to-r from-red-50/80 to-pink-50/80 dark:from-red-950/30 dark:to-pink-950/20 border border-red-100/60 dark:border-red-800/30 text-center backdrop-blur-sm shadow-glass"
        >
          <p className="text-sm text-red-600 dark:text-red-400 mb-3 font-medium">
            {error}
          </p>
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={loadComments}
            className="px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 rounded-full text-xs font-medium text-red-600 dark:text-red-400 shadow-sm hover:shadow-md transition-all backdrop-blur-sm"
          >
            Try Again
          </motion.button>
        </motion.div>
      )}

      {/* Loading state */}
      {isCommentsLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-10"
        >
          <div className="relative">
            <Loader2 className="h-7 w-7 text-ocean dark:text-ocean-light animate-spin mb-3" />
            <div className="absolute inset-0 rounded-full animate-pulse-slow blur-xl bg-ocean/20 dark:bg-ocean/30 -z-10"></div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading comments...
          </p>
        </motion.div>
      ) : comments.length === 0 && !error ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="flex flex-col items-center justify-center py-12 glass-card border-gradient border-gradient-light dark:border-gradient-dark rounded-xl backdrop-blur-sm"
        >
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            className="p-4 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-glass dark:shadow-glass-dark mb-4"
          >
            <MessageSquarePlus className="h-7 w-7 text-ocean dark:text-ocean-light" />
          </motion.div>
          <h3 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-1.5">
            No comments yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 text-center max-w-xs">
            Be the first to share your thoughts on this post
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-5 max-w-2xl mx-auto pt-2"
        >
          <AnimatePresence mode="popLayout">
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                variants={item}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <CommentCard comment={comment} currentUser={currentUser} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};
