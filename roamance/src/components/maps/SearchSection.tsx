'use client';

import { SearchBar } from '@/components/maps';
import { cn } from '@/lib/utils';

interface SearchSectionProps {
  isDarkMode: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function SearchSection({
  isDarkMode,
  searchQuery,
  onSearchChange,
}: SearchSectionProps) {
  return (
    <div
      className={cn(
        'w-full py-3 px-5 relative z-10',
        isDarkMode
          ? 'bg-background/50 backdrop-blur-lg'
          : 'bg-white/60 backdrop-blur-lg'
      )}
    >
      <SearchBar
        value={searchQuery}
        onChange={onSearchChange}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
