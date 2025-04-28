'use client';

import { SocialFeed } from '@/components/social/feed/social-feed';
import { PostCreator } from '@/components/social/post/post-creator';
import { TrendingSection } from '@/components/social/trending-section';
import { User } from '@/types';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';

const mockTrendingItems = [
  { id: '1', title: 'Paris', count: 1245, type: 'location' as const },
  { id: '2', title: 'Adventure Travel', count: 890, type: 'topic' as const },
  { id: '3', title: '#backpacking', count: 756, type: 'hashtag' as const },
  { id: '4', title: 'Santorini', count: 612, type: 'location' as const },
  { id: '5', title: 'Budget Travel', count: 543, type: 'topic' as const },
];

const mockTrendingUsers: User[] = [
  {
    id: 'user1',
    name: 'Maya Expedition',
    email: 'maya@mail.com',
    profile_image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    audit: {
      created_at: new Date().toISOString(),
      last_modified_at: new Date().toISOString(),
    },
  },
  {
    id: 'user2',
    name: 'Ravi Explorer',
    email: '',
    profile_image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    audit: {
      created_at: new Date().toISOString(),
      last_modified_at: new Date().toISOString(),
    },
  },
  {
    id: 'user3',
    name: 'Emma Nomad',
    email: '',
    profile_image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    audit: {
      created_at: new Date().toISOString(),
      last_modified_at: new Date().toISOString(),
    },
  },
  {
    id: 'user4',
    name: 'Leo Wanderer',
    email: '',
    profile_image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    audit: {
      created_at: new Date().toISOString(),
      last_modified_at: new Date().toISOString(),
    },
  },
  {
    id: 'user5',
    name: 'Sofia Journey',
    email: '',
    profile_image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    audit: {
      created_at: new Date().toISOString(),
      last_modified_at: new Date().toISOString(),
    },
  },
  {
    id: 'user6',
    name: 'Kai Adventure',
    email: '',
    profile_image:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6',
    audit: {
      created_at: new Date().toISOString(),
      last_modified_at: new Date().toISOString(),
    },
  },
];

export default function SocialPage() {
  return (
    <>
      {/* Main content - Feed */}
      <div className="flex-1">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Sparkles className="h-6 w-6 mr-2 text-purple-500 dark:text-purple-400" />
            Travel Feed
          </h2>

          {/* Post creation */}
          <div className="mb-8">
            <PostCreator />
          </div>

          {/* Posts feed */}
          <SocialFeed />
        </div>
      </div>

      {/* Right sidebar - Trending */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-24 space-y-6">
          <TrendingSection
            trendingItems={mockTrendingItems}
            trendingUsers={mockTrendingUsers}
          />

          <div className="bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700/50 p-4">
            <h3 className="font-semibold text-base text-gray-900 dark:text-white mb-4">
              Discover Your Next Adventure
            </h3>
            <div className="relative h-40 w-full rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHRyYXZlbHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
                alt="Travel destination"
                layout="fill"
                objectFit="cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <div className="text-white">
                  <h4 className="font-medium text-sm">Bali, Indonesia</h4>
                  <p className="text-xs text-white/80">
                    Explore paradise islands
                  </p>
                </div>
              </div>
            </div>
            <button className="w-full mt-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium text-sm hover:shadow-md transition-shadow">
              Plan Your Trip
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
