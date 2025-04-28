'use client';

import { cn } from '@/lib/utils';
import { User } from '@/types';
import { motion } from 'framer-motion';
import { Flame, Sparkles, TrendingUp, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

/* -------------------------------- User Avatar with Improved UI ------------------------------- */

export interface UserAvatarProps {
  user?: User;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  className?: string;
  imageUrl?: string;
  alt?: string;
  showBorder?: boolean;
  showHoverEffect?: boolean;
  isOnline?: boolean;
}

export const UserAvatar = ({
  user,
  size = 'md',
  href,
  className,
  imageUrl,
  alt,
  showBorder = true,
  showHoverEffect = true,
  isOnline = false,
}: UserAvatarProps) => {
  const sizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  // Online indicator positioning based on avatar size
  const onlineIndicatorClasses = {
    xs: 'h-1.5 w-1.5 -right-0.5 -bottom-0.5',
    sm: 'h-2 w-2 -right-0.5 -bottom-0.5',
    md: 'h-2.5 w-2.5 -right-0.5 -bottom-0.5',
    lg: 'h-3 w-3 -right-0.5 -bottom-0.5',
    xl: 'h-3.5 w-3.5 right-0 bottom-0',
  };

  const avatarImage = (
    <div
      className={cn(
        'relative rounded-full overflow-hidden flex-shrink-0 transition-all duration-300',
        showHoverEffect && 'group-hover:scale-105',
        showBorder &&
          'ring-2 ring-purple-200 dark:ring-purple-700 ring-offset-2 ring-offset-white dark:ring-offset-gray-800',
        sizeClasses[size],
        className
      )}
    >
      <Image
        src={
          imageUrl || user?.profile_image || '/images/roamance-logo-no-text.png'
        }
        alt={alt || user?.name || 'User'}
        layout="fill"
        style={{ objectFit: 'cover' }}
        className="rounded-full"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-black/0 group-hover:from-purple-500/20 group-hover:to-blue-500/10 transition-colors duration-300 rounded-full"></div>

      {isOnline && (
        <span className={cn(
          'absolute block rounded-full bg-green-500 dark:bg-green-400 ring-2 ring-white dark:ring-gray-800',
          onlineIndicatorClasses[size]
        )}></span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group">
        {avatarImage}
      </Link>
    );
  }

  return avatarImage;
};

/* ----------------------------- Trending Icons with Enhanced Animation ------------------------------ */

export interface TrendingIconProps {
  type: 'topic' | 'hashtag' | 'location' | 'user';
  className?: string;
  animate?: boolean;
}

export const TrendingIcon = ({ type, className, animate = false }: TrendingIconProps) => {
  const icon = () => {
    switch (type) {
      case 'topic':
        return <Sparkles className={cn('h-4 w-4 text-purple-500', className)} />;
      case 'hashtag':
        return <TrendingUp className={cn('h-4 w-4 text-blue-500', className)} />;
      case 'location':
        return <Flame className={cn('h-4 w-4 text-amber-500', className)} />;
      case 'user':
        return <Users className={cn('h-4 w-4 text-green-500', className)} />;
      default:
        return null;
    }
  };

  if (animate) {
    return (
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 3, 0],
        }}
        transition={{
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 2,
        }}
      >
        {icon()}
      </motion.div>
    );
  }

  return icon();
};

/* ---------------------------- Media Indicators with Glassmorphism ---------------------------- */

export interface MediaIndicatorProps {
  count: number;
  type: 'image' | 'video';
}

export const MediaIndicator = ({ count, type }: MediaIndicatorProps) => {
  const Icon =
    type === 'image'
      ? ({ className }: { className?: string }) => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        )
      : ({ className }: { className?: string }) => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m22 8-6 4 6 4V8Z" />
            <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
          </svg>
        );

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      className="px-3 py-1.5 bg-black/40 backdrop-blur-xl rounded-lg text-white text-xs font-medium flex items-center shadow-lg border border-white/5"
    >
      <Icon className="h-3.5 w-3.5 mr-1.5" />
      <span>{count}</span>
    </motion.div>
  );
};

/* ----------------------------- Action Button with Improved Animation ------------------------------ */

export interface ActionButtonProps {
  icon: React.ReactNode;
  active?: boolean;
  activeColor?: string;
  count?: number;
  onClick?: () => void;
  label?: string;
  showBg?: boolean;
}

export const ActionButton = ({
  icon,
  active = false,
  activeColor = 'pink',
  count,
  onClick,
  label,
  showBg = false,
}: ActionButtonProps) => {
  const colorClasses = {
    pink: 'text-pink-500 dark:text-pink-400 fill-pink-500 dark:fill-pink-400',
    blue: 'text-blue-500 dark:text-blue-400 fill-blue-500 dark:fill-blue-400',
    purple: 'text-purple-500 dark:text-purple-400 fill-purple-500 dark:fill-purple-400',
    amber: 'text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400',
    green: 'text-green-500 dark:text-green-400 fill-green-500 dark:fill-green-400',
  };

  const activeClasses = colorClasses[activeColor as keyof typeof colorClasses];
  const inactiveClasses = 'text-gray-500 dark:text-gray-400';

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'group flex items-center',
        showBg && 'px-3 py-1.5 rounded-full',
        showBg && active && `bg-${activeColor}-50 dark:bg-${activeColor}-900/20`,
        showBg && !active && 'hover:bg-gray-100 dark:hover:bg-gray-800/60'
      )}
    >
      <div className="relative">
        <div className={cn(
          'transition-colors',
          active ? activeClasses : inactiveClasses,
          'group-hover:' + activeClasses
        )}>
          {icon}
        </div>
      </div>
      {(label || count !== undefined) && (
        <span className={cn(
          'ml-1.5 text-sm font-medium transition-colors',
          active ? activeClasses : inactiveClasses,
          'group-hover:' + activeClasses
        )}>
          {count !== undefined ? count > 0 ? count : label || '' : label}
        </span>
      )}
    </motion.button>
  );
};

/* ----------------------------- Loading States with Enhanced UI ----------------------------- */

export const PostCardSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-sm border border-gray-100/80 dark:border-gray-700/30 p-5">
      <div className="flex items-center space-x-3">
        <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-3 w-1/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
      <div className="h-64 w-full bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
      <div className="flex justify-between">
        <div className="h-5 w-1/5 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-5 w-1/5 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};

export const TrendingItemSkeleton = () => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl animate-pulse">
      <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};

export const UserAvatarSkeleton = ({ size = 'md' }: { size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }) => {
  const sizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <div className={cn(
      'rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse',
      sizeClasses[size]
    )} />
  );
};
