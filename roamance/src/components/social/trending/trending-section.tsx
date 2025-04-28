'use client';

import { cn } from '@/lib/utils';
import { User } from '@/types';
import { TrendingUp, Users } from 'lucide-react';
import { TrendingItem, TrendingItemProps } from './trending-item';
import { TrendingUser } from './trending-user';
import { TrendingItemSkeleton } from '../ui/shared-components';
import { motion } from 'framer-motion';

export interface TrendingSectionProps {
  trendingItems: TrendingItemProps[];
  trendingUsers?: User[];
  loading?: boolean;
  onItemClick?: (item: TrendingItemProps) => void;
  onUserClick?: (user: User) => void;
}

export const TrendingSection = ({
  trendingItems,
  trendingUsers = [],
  loading = false,
  onItemClick,
  onUserClick
}: TrendingSectionProps) => {
  if (loading) {
    return <TrendingSectionSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700/50 transition-all hover:shadow-xl"
    >
      {/* Decorative top gradient line */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

      <TrendingSectionHeader
        title="Trending Now"
        icon={<TrendingUp className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />}
      />

      <div className="divide-y divide-gray-50 dark:divide-gray-700/30 max-h-[300px] overflow-y-auto scrollbar-hide">
        {trendingItems.map(item => (
          <TrendingItem
            key={item.id}
            {...item}
            onClick={() => onItemClick?.(item)}
          />
        ))}
      </div>

      {trendingUsers && trendingUsers.length > 0 && (
        <div className="mt-1">
          <TrendingSectionHeader
            title="Travelers to Follow"
            icon={<Users className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />}
            className="pt-2"
            bordered
          />

          <div className="p-4 grid grid-cols-3 gap-1 max-h-[150px] overflow-y-auto scrollbar-hide">
            {trendingUsers.slice(0, 6).map(user => (
              <TrendingUser
                key={user.id}
                user={user}
                onClick={() => onUserClick?.(user)}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

interface TrendingSectionHeaderProps {
  title: string;
  icon: React.ReactNode;
  className?: string;
  bordered?: boolean;
}

const TrendingSectionHeader = ({ title, icon, className, bordered = false }: TrendingSectionHeaderProps) => (
  <div className={cn(
    "p-4 flex items-center",
    bordered && "border-t border-b border-gray-100 dark:border-gray-700/30",
    className
  )}>
    <h3 className="font-semibold text-base text-gray-900 dark:text-white flex items-center">
      {icon}
      {title}
    </h3>
  </div>
);

// Skeleton loader for the trending section
export const TrendingSectionSkeleton = () => (
  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700/50">
    <div className="h-1 w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"></div>
    <div className="p-4 flex items-center">
      <div className="h-5 w-5 mr-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
    <div className="divide-y divide-gray-50 dark:divide-gray-700/30">
      {Array(4).fill(0).map((_, i) => (
        <TrendingItemSkeleton key={i} />
      ))}
    </div>
  </div>
);
