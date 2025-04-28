'use client';

import { useSocialContext } from '@/context/SocialContext';
import { Post } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bookmark,
  FolderHeart,
  Loader2,
  RefreshCcw,
  Search,
  SearchX,
  X,
} from 'lucide-react';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CommentDialog } from '../comment';
import { PostCard } from '../post/post-card';

export const SavedPostsSection = () => {
  const { user, savedPosts, fetchSavedPosts, isSavedPostsLoading, isLoading } =
    useSocialContext();

  // Fetch saved posts once after user profile loads
  useEffect(() => {
    if (!isLoading) {
      fetchSavedPosts();
    }
  }, [isLoading, fetchSavedPosts]);

  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // State for comment dialog
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Filter posts based on search term
  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) return savedPosts;

    const lowercasedSearch = searchTerm.toLowerCase();
    return savedPosts.filter(
      (post) =>
        post.text?.toLowerCase().includes(lowercasedSearch) ||
        post.user?.name?.toLowerCase().includes(lowercasedSearch)
    );
  }, [savedPosts, searchTerm]);

  // Clear search term
  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
  }, [setSearchTerm]);

  // Rest of handlers
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSavedPosts();
    setRefreshing(false);
  }, [fetchSavedPosts, setRefreshing]);

  const handleComment = useCallback(
    (postId: string) => {
      const post = savedPosts.find((p) => p.id === postId);
      if (post) {
        setSelectedPost(post);
        setCommentDialogOpen(true);
      } else {
        toast.error('Post not found');
      }
    },
    [savedPosts, setSelectedPost, setCommentDialogOpen]
  );

  return (
    <div className="w-full">
      {/* Redesigned Header with Integrated Search */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 p-6 rounded-3xl mb-10 shadow-lg border border-gray-100 dark:border-gray-800/40"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left side - Title and Icon */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, 0],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: 'reverse',
                  duration: 4,
                }}
                className="absolute -inset-3 bg-gradient-to-br from-purple-300/30 to-indigo-300/30 dark:from-purple-700/30 dark:to-indigo-700/20 rounded-full blur-xl"
              />
              <div className="relative h-12 w-12 flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/60 dark:to-indigo-900/60 rounded-2xl shadow-inner border border-purple-200/50 dark:border-purple-800/30">
                <Bookmark className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
                Your Collection
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {savedPosts.length} saved{' '}
                {savedPosts.length === 1 ? 'post' : 'posts'}
              </p>
            </div>
          </div>

          {/* Center/Right - Integrated Search Bar */}
          <div className="flex-grow flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full max-w-md">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Search your saved posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-10 py-3 rounded-full bg-white/60 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm backdrop-blur-sm transition-all"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {searchTerm && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-4 -bottom-6 text-xs text-gray-500 dark:text-gray-400"
                >
                  Found {filteredPosts.length}{' '}
                  {filteredPosts.length === 1 ? 'post' : 'posts'}
                </motion.div>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing || isSavedPostsLoading}
              className="px-5 py-3 rounded-full bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:shadow-md transition-all flex items-center disabled:opacity-70 border border-indigo-100 dark:border-indigo-800/30 group whitespace-nowrap flex-shrink-0"
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
              )}
              Refresh
            </button>
          </div>
        </div>
      </motion.div>

      {/* Loading state */}
      {isSavedPostsLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative p-4"
          >
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.05, 1],
              }}
              transition={{
                rotate: { repeat: Infinity, duration: 2, ease: 'linear' },
                scale: { repeat: Infinity, duration: 2, repeatType: 'reverse' },
              }}
              className="h-16 w-16 rounded-full border-4 border-t-purple-500 border-r-indigo-500 border-b-blue-500 border-l-transparent"
            />
            <div className="absolute inset-0 bg-purple-200/50 dark:bg-purple-700/20 rounded-full blur-xl -z-10"></div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mt-6 text-gray-600 dark:text-gray-400 text-lg font-medium"
          >
            Loading your collection...
          </motion.p>
        </div>
      ) : savedPosts.length === 0 ? (
        <EmptyCollectionState />
      ) : (
        <>
          {/* Posts grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <AnimatePresence mode="popLayout">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                      delay: Math.min(index * 0.1, 0.5),
                    }}
                    className="backdrop-blur-sm"
                    whileHover={{
                      y: -5,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <PostCard post={post} onCommentAction={handleComment} />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-2 py-16 flex flex-col items-center justify-center"
                >
                  <div className="relative">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        repeatType: 'reverse',
                      }}
                      className="absolute inset-0 bg-purple-200/30 dark:bg-purple-700/20 rounded-full blur-xl"
                    />
                    <div className="relative inline-flex justify-center items-center p-5 rounded-full bg-gradient-to-br from-white/90 to-purple-50/90 dark:from-gray-800/80 dark:to-purple-900/40 shadow-md backdrop-blur-sm border border-purple-100/50 dark:border-purple-800/30 mb-4">
                      <SearchX className="h-6 w-6 text-purple-500 dark:text-purple-400" />
                    </div>
                  </div>

                  <h3 className="text-xl font-medium bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-300 dark:to-gray-100 bg-clip-text text-transparent mb-3 mt-4">
                    No matching posts found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-5 text-center text-sm">
                    We couldn&apos;t find any posts matching your search
                    criteria.
                  </p>
                  <motion.button
                    onClick={handleClearSearch}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-5 py-2.5 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all border border-purple-100/50 dark:border-purple-800/30 backdrop-blur-sm"
                  >
                    Clear search
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* Comment Dialog */}
      {selectedPost && (
        <CommentDialog
          post={selectedPost}
          currentUser={user}
          open={commentDialogOpen}
          onOpenChange={setCommentDialogOpen}
        />
      )}
    </div>
  );
};

const EmptyCollectionState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        type: 'spring',
        stiffness: 100,
      }}
      className="text-center py-16 px-8 rounded-3xl bg-gradient-to-br from-purple-50/90 via-indigo-50/90 to-blue-50/90 dark:from-purple-950/40 dark:via-indigo-950/40 dark:to-blue-950/40 border border-purple-100/80 dark:border-purple-800/30 shadow-xl backdrop-blur-sm"
    >
      <div className="max-w-md mx-auto">
        <div className="relative mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 10,
              delay: 0.2,
            }}
            className="inline-flex justify-center items-center w-24 h-24 rounded-2xl bg-gradient-to-br from-white/90 to-purple-50/90 dark:from-gray-800/90 dark:to-purple-900/30 shadow-lg backdrop-blur-sm border border-purple-100 dark:border-purple-800/30"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, 0],
              }}
              transition={{
                repeat: Infinity,
                repeatType: 'reverse',
                duration: 3,
              }}
            >
              <Bookmark className="h-12 w-12 text-purple-500 dark:text-purple-400" />
            </motion.div>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0, x: -70, y: -20 }}
            animate={{ opacity: 1, x: -70, y: -20 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.4 }}
            className="absolute hidden md:block"
          >
            <div className="p-3 rounded-full bg-gradient-to-br from-white/80 to-indigo-50/80 dark:from-gray-800/80 dark:to-indigo-900/30 shadow-lg backdrop-blur-sm border border-indigo-100/30 dark:border-indigo-800/20">
              <SearchX className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 70, y: 20 }}
            animate={{ opacity: 1, x: 70, y: 20 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.5 }}
            className="absolute hidden md:block"
          >
            <div className="p-3 rounded-full bg-gradient-to-br from-white/80 to-purple-50/80 dark:from-gray-800/80 dark:to-purple-900/30 shadow-lg backdrop-blur-sm border border-purple-100/30 dark:border-purple-800/20">
              <FolderHeart className="h-5 w-5 text-purple-500 dark:text-purple-400" />
            </div>
          </motion.div>
        </div>

        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4"
        >
          Your Collection is Empty
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8 leading-relaxed text-lg"
        >
          Save posts you love to revisit them later. Look for the bookmark icon
          on posts to add them to your collection!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="inline-flex items-center px-5 py-2.5 rounded-xl bg-white/70 dark:bg-gray-800/70 shadow-md backdrop-blur-sm border border-purple-100/50 dark:border-purple-800/30"
        >
          <Bookmark className="h-5 w-5 mr-2 text-purple-500 dark:text-purple-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Tap the bookmark icon on any post to save it
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};
