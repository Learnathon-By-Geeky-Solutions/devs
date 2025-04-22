'use client';

import { cn } from '@/lib/utils';
import { Geoname } from '@/types/places';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface SearchResultsListProps {
  results: Geoname[];
  onSelectResult: (geoname: Geoname) => void;
  isDarkMode: boolean;
  accentColor?: string; // Optional color for the pin icon
}

export function SearchResultsList({
  results,
  onSelectResult,
  isDarkMode,
  accentColor = 'text-primary',
}: SearchResultsListProps) {
  if (results.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'absolute left-0 right-0 mt-1 rounded-lg shadow-lg z-50 max-h-[200px] overflow-y-auto',
        isDarkMode
          ? 'bg-card border border-muted/30'
          : 'bg-white border border-muted/20'
      )}
    >
      {results.map((result) => (
        <div
          key={`${result.geonameId || result.name}`}
          className={cn(
            'px-3 py-2 text-xs cursor-pointer flex items-start gap-2 transition-colors',
            isDarkMode
              ? 'hover:bg-muted/30'
              : 'hover:bg-muted/20'
          )}
          onClick={() => onSelectResult(result)}
        >
          <MapPin className={cn("h-3 w-3 mt-0.5", accentColor)} />
          <div>
            <p className="font-medium">
              {result.toponymName || result.name}
            </p>
            <p className="text-2xs text-muted-foreground">
              {[result.adminName1, result.countryName]
                .filter(Boolean)
                .join(', ')}
            </p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
