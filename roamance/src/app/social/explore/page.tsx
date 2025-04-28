'use client';

import { Compass } from 'lucide-react';

export default function ExplorePage() {
  return (
    <div className="flex-1">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <Compass className="h-6 w-6 mr-2 text-purple-500 dark:text-purple-400" />
          Explore
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <p className="text-gray-600 dark:text-gray-300">Explore travel content and destinations here.</p>
        </div>
      </div>
    </div>
  );
}
