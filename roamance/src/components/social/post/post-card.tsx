'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useSocialContext } from '@/context/SocialContext';
import { cn } from '@/lib/utils';
import { Post } from '@/types';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Bookmark,
  Edit,
  Heart,
  ImageIcon,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Sparkles,
  Trash2,
  UserPlus,
  Video,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const EMPTY_TIDBITS = 'Nothing to show';

interface PostCardProps {
  post: Post;
  onCommentAction: (postId: string) => void;
}

export const PostCard = ({
  post,
  onCommentAction: onComment,
}: PostCardProps) => {
  const { user, savedPosts, toggleLikePost, toggleSavePost, deletePost } =
    useSocialContext();
  const [showAll, setShowAll] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [shareTooltip, setShareTooltip] = useState(false);
  const [showUnsafeContent, setShowUnsafeContent] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const tooltipTimeout = useRef<NodeJS.Timeout | null>(null);

  // Ensure savedPosts are loaded

  const isLiked = post.liked_by?.some((liker) => liker.id === user?.id);
  const isSaved = savedPosts?.some((savedPost) => savedPost.id === post.id);
  const isOwnPost = post.user.id === user?.id;
  const isUnsafe = post.is_safe === false;

  const hasMedia = post.image_paths.length > 0 || post.video_paths.length > 0;
  const totalMedia = post.image_paths.length + post.video_paths.length;

  useEffect(() => {
    return () => {
      if (tooltipTimeout.current) {
        clearTimeout(tooltipTimeout.current);
      }
    };
  }, []);

  const handleNext = () => {
    if (currentImageIndex < totalMedia - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    } else {
      setCurrentImageIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    } else {
      setCurrentImageIndex(totalMedia - 1);
    }
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Close the menu when clicking outside of it
  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setShowMenu(false);
    }
  };

  // Add event listener for outside clicks when menu is open
  useEffect(() => {
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleLikeClick = () => {
    setIsLikeAnimating(true);
    toggleLikePost(post.id);
    setTimeout(() => setIsLikeAnimating(false), 1000);
  };

  const handleSaveClick = useCallback(() => {
    toggleSavePost(post);
  }, [post, toggleSavePost]);

  const handleShareClick = useCallback(() => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
    toast.success('Post link copied to clipboard!');

    setShareTooltip(true);

    if (tooltipTimeout.current) {
      clearTimeout(tooltipTimeout.current);
    }

    tooltipTimeout.current = setTimeout(() => {
      setShareTooltip(false);
    }, 2000);
  }, [post.id]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInSecs = Math.floor(diffInMs / 1000);
    const diffInMins = Math.floor(diffInSecs / 60);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSecs < 60) {
      return 'just now';
    } else if (diffInMins < 60) {
      return `${diffInMins}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="min-h-48 md:min-h-64 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/30 transition-all duration-300 flex flex-col md:flex-row relative border border-gray-100/30 dark:border-gray-700/20"
    >
      {/* Safety Overlay - Redesigned */}
      {isUnsafe && !showUnsafeContent && (
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center rounded-2xl">
          <div className="bg-red-500/10 p-3 rounded-full mb-4 border border-red-500/20">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Sensitive Content
          </h3>
          <p className="text-sm text-gray-300 mb-5 max-w-xs">
            This content may contain material that some users find sensitive.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUnsafeContent(true)}
            className="px-5 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded-full backdrop-blur-sm border border-white/30 font-medium transition-all"
          >
            View Content
          </motion.button>
        </div>
      )}

      {/* Post Media Section with Tidbits Button */}
      {hasMedia && (
        <div
          className={cn(
            'relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/80 group md:w-[45%] flex-shrink-0',
            isUnsafe && !showUnsafeContent ? 'filter blur-xl' : ''
          )}
        >
          <div className="aspect-[4/3] md:aspect-square h-full">
            {currentImageIndex < post.image_paths.length ? (
              <Image
                src={post.image_paths[currentImageIndex]}
                alt={`Post image ${currentImageIndex + 1}`}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-500 ease-out group-hover:scale-105"
              />
            ) : (
              <video
                src={
                  post.video_paths[currentImageIndex - post.image_paths.length]
                }
                className="w-full h-full object-cover"
                controls
                preload="metadata"
              />
            )}

            {/* Image overlay gradient - Enhanced to ensure button visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>
          </div>

          {/* Image navigation - Refined */}
          {totalMedia > 1 && (
            <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <motion.button
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrev}
                className="h-9 w-9 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center text-white/90 border border-white/10 shadow-lg transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                className="h-9 w-9 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center text-white/90 border border-white/10 shadow-lg transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </motion.button>
            </div>
          )}

          {/* Media indicators - Subtle dots */}
          {totalMedia > 1 && (
            <div className="absolute bottom-3.5 left-1/2 transform -translate-x-1/2 flex space-x-1.5 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1.5 transition-all duration-300">
              {Array.from({ length: totalMedia }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    'rounded-full transition-all duration-200',
                    currentImageIndex === index
                      ? 'w-2 h-2 bg-white scale-110'
                      : 'w-1.5 h-1.5 bg-white/60 hover:bg-white/90'
                  )}
                  aria-label={`Go to media ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Media type indicators - Minimalist style */}
          <div className="absolute top-3 right-3 flex space-x-1.5">
            {post.image_paths.length > 0 && (
              <div className="p-1.5 bg-black/30 backdrop-blur-sm rounded-md text-white/90 flex items-center shadow-sm">
                <ImageIcon className="h-3.5 w-3.5" />
                {post.image_paths.length > 1 && (
                  <span className="ml-1 text-xs">
                    {post.image_paths.length}
                  </span>
                )}
              </div>
            )}
            {post.video_paths.length > 0 && (
              <div className="p-1.5 bg-black/30 backdrop-blur-sm rounded-md text-white/90 flex items-center shadow-sm">
                <Video className="h-3.5 w-3.5" />
                {post.video_paths.length > 1 && (
                  <span className="ml-1 text-xs">
                    {post.video_paths.length}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Tidbits Button - Icon-only that expands on hover */}
          {post.tidbits &&
            post.tidbits.length > 0 &&
            post.tidbits != EMPTY_TIDBITS && (
              <Popover>
                <PopoverTrigger asChild>
                  <motion.div
                    className="absolute left-3 bottom-3 z-10 group/tidbits"
                    whileHover={{ scale: 1 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                        delay: 0.2,
                      }}
                      className="flex items-center gap-1.5 px-0 py-0 overflow-hidden group-hover/tidbits:pl-1.5 group-hover/tidbits:pr-2.5 group-hover/tidbits:py-1.5 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/40 text-white border border-white/20 text-xs font-medium shadow-lg transition-all duration-300"
                    >
                      <span className="relative flex h-8 w-8 items-center justify-center shrink-0">
                        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 opacity-85"></span>
                        <Sparkles className="h-3.5 w-3.5 text-white z-10" />
                        <motion.span
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-violet-600"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 0.9, 0.7],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: 'reverse',
                          }}
                        />
                      </span>
                      <span className="overflow-hidden whitespace-nowrap w-0 group-hover/tidbits:w-auto group-hover/tidbits:ml-0.5 transition-all duration-300 ease-out">
                        Travel Tidbits
                      </span>
                    </motion.button>
                  </motion.div>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-xl border border-purple-100/50 dark:border-purple-800/30 rounded-xl">
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                      <Sparkles className="h-3.5 w-3.5 mr-2 text-violet-500 dark:text-violet-400" />
                      Travel Tidbits
                    </h3>
                    <div className="bg-violet-100 dark:bg-violet-900/30 px-2 py-0.5 rounded-full text-[10px] text-violet-600 dark:text-violet-300 font-medium">
                      Exclusive
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap mt-2 max-h-[150px] overflow-y-auto pr-1 border-l-2 border-purple-100 dark:border-purple-800/40 pl-3 italic">
                    {post.tidbits}
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/30 flex items-center justify-between">
                    <div className="flex items-center text-[11px] text-gray-500 dark:text-gray-400">
                      <Image
                        src={
                          post.user.profile_image ||
                          '/images/roamance-logo-no-text.png'
                        }
                        alt={post.user.name || 'User'}
                        width={18}
                        height={18}
                        className="rounded-full mr-1.5 border border-white dark:border-gray-800"
                      />
                      <span>
                        Shared {formatTimestamp(post.audit.created_at)}
                      </span>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
        </div>
      )}

      {/* Content Container - Enhanced */}
      <div
        className={cn(
          'flex flex-col flex-grow overflow-hidden',
          isUnsafe && !showUnsafeContent
            ? 'filter blur-sm pointer-events-none'
            : ''
        )}
      >
        {/* Post Header - Refined */}
        <div className="flex items-start justify-between p-5 pb-3">
          <div className="flex items-center space-x-3">
            {/* User Avatar with animated border on hover */}
            <Link
              href={`/profile/${post.user.id}`}
              className="relative h-10 w-10 rounded-full overflow-hidden group shrink-0"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              <div className="absolute inset-[2px] bg-white dark:bg-gray-800 rounded-full z-0"></div>
              <Image
                src={
                  post.user.profile_image || '/images/roamance-logo-no-text.png'
                }
                alt={post.user.name || 'User'}
                layout="fill"
                objectFit="cover"
                className="rounded-full transition-transform duration-300 group-hover:scale-105 z-10 relative"
              />
            </Link>
            <div>
              <Link
                href={`/profile/${post.user.id}`}
                className="text-sm font-semibold text-gray-800 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                {post.user.name}
              </Link>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-0.5 space-x-2">
                {post.location && (
                  <div className="flex items-center hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
                    <MapPin className="h-3 w-3 mr-1 text-pink-500/80 dark:text-pink-400/80" />
                    <span className="truncate max-w-[120px]">
                      {`${post.location.latitude.toFixed(1)}, ${post.location.longitude.toFixed(1)}`}
                    </span>
                  </div>
                )}
                <span className="text-gray-400 dark:text-gray-500">•</span>
                <span>{formatTimestamp(post.audit.created_at)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1 relative">
            {!isOwnPost && (
              <motion.button
                whileHover={{
                  scale: 1.08,
                  backgroundColor: 'rgba(168, 85, 247, 0.1)',
                }}
                whileTap={{ scale: 0.95 }}
                className="p-1.5 rounded-full text-purple-500 dark:text-purple-400 transition-colors"
                aria-label="Follow user"
              >
                <UserPlus className="h-4 w-4" />
              </motion.button>
            )}
            <motion.button
              whileHover={{
                scale: 1.08,
                backgroundColor: 'rgba(107, 114, 128, 0.1)',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMenu}
              className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
              aria-label="More options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </motion.button>

            {/* Post Actions Menu - Enhanced */}
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                ref={menuRef}
                className="absolute right-0 top-8 z-20 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-lg rounded-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 min-w-[160px] transform origin-top-right"
              >
                <div className="py-1">
                  {isOwnPost && (
                    <>
                      <button
                        onClick={() => {
                          setShowMenu(false);
                        }}
                        className="flex items-center w-full px-3.5 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                      >
                        <Edit className="h-3.5 w-3.5 mr-2.5" />
                        Edit post
                      </button>
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          deletePost(post.id);
                        }}
                        className="flex items-center w-full px-3.5 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-2.5" />
                        Delete post
                      </button>
                      <div className="border-t border-gray-100 dark:border-gray-700/30 my-1"></div>
                    </>
                  )}
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      handleShareClick();
                    }}
                    className="flex items-center w-full px-3.5 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                  >
                    <Share2 className="h-3.5 w-3.5 mr-2.5" />
                    Share post
                  </button>
                  {/* {!isOwnPost && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                      }}
                      className="flex items-center w-full px-3.5 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                    >
                      <Flag className="h-3.5 w-3.5 mr-2.5" />
                      Report post
                    </button>
                  )} */}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Post Content - Without tidbits tab */}
        <div className="px-5 py-2 flex-grow">
          <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-line">
            {showAll
              ? post.text
              : post.text.length > 150
                ? `${post.text.substring(0, 150)}…`
                : post.text}
            {post.text.length > 150 && !showAll && (
              <button
                onClick={() => setShowAll(true)}
                className="ml-1 text-purple-600 dark:text-purple-400 text-xs font-medium hover:underline focus:outline-none"
              >
                more
              </button>
            )}
          </p>
        </div>

        {/* Post Actions - Display mobile tidbits button only when there's no media */}
        <div className="px-5 py-3 border-t border-gray-100/70 dark:border-gray-700/30 flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-6">
            {/* Like button with refined animation */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLikeClick}
              className="group flex items-center relative"
              aria-label={isLiked ? 'Unlike post' : 'Like post'}
            >
              <div className="relative">
                <Heart
                  className={cn(
                    'h-5 w-5 mr-1.5 transition-all duration-200',
                    isLiked
                      ? 'fill-pink-500 text-pink-500 dark:fill-pink-400 dark:text-pink-400'
                      : 'text-gray-400 dark:text-gray-500 group-hover:text-pink-500 dark:group-hover:text-pink-400'
                  )}
                  strokeWidth={isLiked ? 1.5 : 2}
                />
                {isLikeAnimating && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{
                      scale: [1, 1.6, 1.2],
                      opacity: [0.8, 1, 0],
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Heart className="h-5 w-5 fill-pink-500 text-pink-500" />
                  </motion.div>
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-medium transition-colors',
                  isLiked
                    ? 'text-pink-500 dark:text-pink-400'
                    : 'text-gray-500 dark:text-gray-400 group-hover:text-pink-500 dark:group-hover:text-pink-400'
                )}
              >
                {post.likes_count || ''}
              </span>
            </motion.button>

            {/* Comment button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onComment(post.id)}
              className="group flex items-center text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              aria-label="Comment on post"
            >
              <MessageCircle className="h-5 w-5 mr-1.5 transition-colors group-hover:text-blue-500 dark:group-hover:text-blue-400" />
              <span className="text-xs font-medium transition-colors group-hover:text-blue-500 dark:group-hover:text-blue-400">
                {post.comments_count || ''}
              </span>
            </motion.button>

            {/* Mobile-only Tidbits button when there's no media - Icon-only that expands on hover */}
            {!hasMedia &&
              post.tidbits &&
              post.tidbits.length > 0 &&
              post.tidbits != EMPTY_TIDBITS && (
                <Popover>
                  <PopoverTrigger asChild>
                    <motion.div
                      className="group/tidbits flex items-center relative"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="relative flex items-center justify-center h-6 w-6 shrink-0">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-violet-500 opacity-20 dark:opacity-30"
                        />
                        <Sparkles className="h-5 w-5 text-violet-500 dark:text-violet-400 relative z-10" />
                      </div>
                      <span className="overflow-hidden max-w-0 whitespace-nowrap group-hover/tidbits:max-w-xs group-hover/tidbits:ml-1.5 text-xs font-medium text-violet-500 dark:text-violet-400 transition-all duration-300 ease-out">
                        Travel Tidbits
                      </span>
                    </motion.div>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-xl border border-purple-100/50 dark:border-purple-800/30 rounded-xl">
                    {/* Same content as main popup */}
                    <div className="mb-1 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                        <Sparkles className="h-3.5 w-3.5 mr-2 text-violet-500 dark:text-violet-400" />
                        Travel Tidbits
                      </h3>
                      <div className="bg-violet-100 dark:bg-violet-900/30 px-2 py-0.5 rounded-full text-[10px] text-violet-600 dark:text-violet-300 font-medium">
                        Exclusive
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap mt-2 max-h-[150px] overflow-y-auto pr-1 border-l-2 border-purple-100 dark:border-purple-800/40 pl-3 italic">
                      {post.tidbits}
                    </p>
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/30 flex items-center justify-between">
                      <div className="flex items-center text-[11px] text-gray-500 dark:text-gray-400">
                        <Image
                          src={
                            post.user.profile_image ||
                            '/images/roamance-logo-no-text.png'
                          }
                          alt={post.user.name || 'User'}
                          width={18}
                          height={18}
                          className="rounded-full mr-1.5 border border-white dark:border-gray-800"
                        />
                        <span>
                          Shared {formatTimestamp(post.audit.created_at)}
                        </span>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Save button using Bookmark */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSaveClick}
              className={cn(
                'group p-1.5 rounded-full transition-colors',
                isSaved
                  ? 'bg-purple-100 dark:bg-purple-900/30'
                  : 'hover:bg-purple-50 dark:hover:bg-purple-900/20'
              )}
              aria-label={isSaved ? 'Unsave post' : 'Save post'}
            >
              <Bookmark
                className={cn(
                  'h-4.5 w-4.5 transition-all duration-200',
                  isSaved
                    ? 'fill-purple-500 text-purple-500 dark:fill-purple-400 dark:text-purple-400'
                    : 'text-gray-400 dark:text-gray-500 group-hover:text-purple-500 dark:group-hover:text-purple-400'
                )}
                strokeWidth={isSaved ? 1.5 : 2}
              />
            </motion.button>

            {/* Share button with tooltip */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleShareClick}
              className="group p-1.5 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors relative"
              aria-label="Share post"
            >
              <Share2
                className="h-4.5 w-4.5 text-gray-400 dark:text-gray-500 group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors"
                strokeWidth={2}
              />

              {/* Share tooltip */}
              {shareTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute -top-8 right-0 bg-black/75 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm whitespace-nowrap"
                >
                  Copied to clipboard
                </motion.div>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Decorative wave line pattern - bottom right */}
      {post?.image_paths.length === 0 && post?.video_paths.length === 0 && (
        <div className="absolute -bottom-20 -right-24 -z-1 pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative w-80 h-64 md:w-[450px] md:h-72" // Significantly increased size for better overflow
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 400 300" // Larger viewBox for more space to draw
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute bottom-0 right-0 opacity-15 dark:opacity-10"
            >
              {/* Wave lines with modified bending position */}
              {[...Array(10)].map((_, i) => (
                <motion.path
                  key={i}
                  // Modified path with different bending position
                  d={`M${-50 + i * 12},300 Q${50 + i * 10},${50 + i * 8} ${250 + i * 15},${100 + i * 5}`}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-purple-400 dark:text-purple-500"
                  strokeDasharray="450"
                  initial={{ strokeDashoffset: 450 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{
                    duration: 1.5,
                    delay: 0.1 * i,
                    ease: 'easeOut',
                  }}
                />
              ))}
              {/* Dotted effect with matching path */}
              {[...Array(10)].map((_, i) => (
                <motion.path
                  key={`dots-${i}`}
                  d={`M${-50 + i * 12},300 Q${50 + i * 10},${50 + i * 8} ${250 + i * 15},${100 + i * 5}`}
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeDasharray="3 6"
                  className="text-purple-300 dark:text-purple-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.15 * i + 0.6,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </svg>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
