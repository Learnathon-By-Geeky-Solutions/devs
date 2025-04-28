'use client';

import { useSocialContext } from '@/context/SocialContext';
import { Post } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpDown, Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CommentDialog } from '../comment';
import { PostCard } from '../post/post-card';
import { EmptyFeed } from './empty-feed';
import { FeedSkeleton } from './feed-skeleton';

export const SocialFeed = () => {
  const { user, posts, fetchPosts, fetchSavedPosts, isPostsLoading, error } =
    useSocialContext();

  const [sortOption, setSortOption] = useState<'latest' | 'popular'>('latest');

  // State for comment dialog
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    fetchPosts();
    fetchSavedPosts();
  }, [fetchPosts, fetchSavedPosts]);

  const handleComment = useCallback(
    (postId: string) => {
      const post = posts.find((p) => p.id === postId);
      if (post) {
        setSelectedPost(post);
        setCommentDialogOpen(true);
      } else {
        toast.error('Post not found');
      }
    },
    [posts]
  );

  const toggleSortOption = () => {
    setSortOption((prev) => (prev === 'latest' ? 'popular' : 'latest'));
    // For demo purposes, we're just changing the state but not actually sorting
    toast.success(
      `Sorted by ${sortOption === 'latest' ? 'popularity' : 'latest posts'}`
    );
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortOption === 'popular') {
      return (b.likes_count || 0) - (a.likes_count || 0);
    }
    // Sort by created_at for latest (default sorting)
    return (
      new Date(b.audit.created_at).getTime() -
      new Date(a.audit.created_at).getTime()
    );
  });

  return (
    <div className="w-full">
      {/* Feed header with refresh button and controls */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 p-4 rounded-2xl mb-8 shadow-sm border border-gray-100 dark:border-gray-800/40">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent inline-flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
            Explore Moments
          </h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleSortOption}
              disabled={isPostsLoading}
              className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 text-sm font-medium shadow-sm hover:shadow-md transition-all flex items-center disabled:opacity-70 border border-gray-100 dark:border-gray-700"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              {sortOption === 'latest' ? 'Latest' : 'Popular'}
            </button>
            <button
              onClick={fetchPosts}
              disabled={isPostsLoading}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:shadow-md transition-all flex items-center disabled:opacity-70 border border-indigo-100 dark:border-indigo-800/30"
            >
              {isPostsLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 mb-8 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border border-red-100 dark:border-red-800/30 text-center backdrop-blur-sm shadow-sm"
        >
          <p className="text-red-600 dark:text-red-400 mb-2 font-medium">
            {error}
          </p>
          <button
            onClick={fetchPosts}
            className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-sm font-medium text-red-600 dark:text-red-400 shadow-sm hover:shadow-md transition-all"
          >
            Try Again
          </button>
        </motion.div>
      )}

      {/* Loading state */}
      {isPostsLoading ? (
        <FeedSkeleton />
      ) : posts.length === 0 ? (
        <EmptyFeed />
      ) : (
        <div className="max-w-2xl mx-auto space-y-8">
          <AnimatePresence mode="popLayout">
            {sortedPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                layout
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                  delay: Math.min(index * 0.08, 0.4), // Cap the delay at 0.4s
                }}
                className="backdrop-blur-sm"
              >
                <PostCard post={post} onCommentAction={handleComment} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
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
