import { User } from '@/types';
import { motion } from 'framer-motion';
import { Flame, Sparkles, TrendingUp, Users } from 'lucide-react';
import Image from 'next/image';

interface TrendingItemProps {
  id: string;
  title: string;
  imageSrc?: string;
  count: number;
  type: 'topic' | 'hashtag' | 'location' | 'user';
}

interface TrendingSectionProps {
  trendingItems: TrendingItemProps[];
  trendingUsers?: User[];
}

const TrendingItem = ({ title, imageSrc, count, type }: TrendingItemProps) => {
  const getIcon = () => {
    switch (type) {
      case 'topic':
        return <Sparkles className="h-4 w-4 text-purple-500" />;
      case 'hashtag':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'location':
        return <Flame className="h-4 w-4 text-amber-500" />;
      case 'user':
        return <Users className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors cursor-pointer"
    >
      {imageSrc ? (
        <div className="relative h-10 w-10 rounded-lg overflow-hidden">
          <Image
            src={imageSrc}
            alt={title}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-100 dark:border-purple-800/30">
          {getIcon()}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
          {title}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {count.toLocaleString()} {type === 'user' ? 'travelers' : 'posts'}
        </p>
      </div>
    </motion.div>
  );
};

export const TrendingSection = ({
  trendingItems,
  trendingUsers = [],
}: TrendingSectionProps) => {
  return (
    <div className="bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700/50">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/30">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />
          Trending Now
        </h3>
      </div>

      <div className="divide-y divide-gray-50 dark:divide-gray-700/30">
        {trendingItems.map((item) => (
          <TrendingItem key={item.id} {...item} />
        ))}
      </div>

      {trendingUsers && trendingUsers.length > 0 && (
        <>
          <div className="p-4 border-t border-b border-gray-100 dark:border-gray-700/30 mt-2">
            <h3 className="font-semibold text-base text-gray-900 dark:text-white flex items-center">
              <Users className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
              Travelers to Follow
            </h3>
          </div>

          <div className="p-3 flex flex-wrap gap-2">
            {trendingUsers.slice(0, 6).map((user) => (
              <div
                key={user.id}
                className="flex flex-col items-center gap-1 p-2 cursor-pointer group"
              >
                <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-purple-100 dark:border-purple-800/30 group-hover:border-purple-300 dark:group-hover:border-purple-700 transition-colors">
                  <Image
                    src={
                      user.profile_image || '/images/roamance-logo-no-text.png'
                    }
                    alt={user.name || user.email || 'User'}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors text-center truncate max-w-[60px]">
                  {user.name || user.email}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
