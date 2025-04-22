'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Globe, MapPin, User } from 'lucide-react';

interface SearchResultsProps {
  results: {
    name: string;
    lat: number;
    lng: number;
    country?: string;
    adminName?: string;
    population?: number;
  }[];
  onSelect: (lat: number, lng: number) => void;
  isDarkMode: boolean;
  isSearching: boolean;
}

export function SearchResults({
  results,
  onSelect,
  isDarkMode,
  isSearching,
}: SearchResultsProps) {
  const hasResults = isSearching || results.length > 0;

  return (
    <AnimatePresence>
      {hasResults && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'absolute top-12 inset-x-0 mx-auto z-[1000] w-[40%] max-w-xl',
            'overflow-hidden rounded-xl shadow-lg border',
            isDarkMode
              ? 'bg-background/60 border-muted/20 shadow-black/20'
              : 'bg-white/90 border-muted/10 shadow-black/10'
          )}
          style={{ maxWidth: 'calc(100% - 2.5rem)' }}
        >
          <div className="backdrop-blur-md">
            {/* Decorative top accent bar */}
            <div
              className={cn(
                'h-1 w-full bg-gradient-to-r',
                isDarkMode
                  ? 'from-primary/40 via-blue-500/30 to-primary/40'
                  : 'from-primary/30 via-blue-400/20 to-primary/30'
              )}
            />

            {/* Search results content */}
            <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
              {isSearching ? (
                <div className="p-6 flex flex-col items-center justify-center">
                  <div className="relative">
                    <motion.div
                      className={cn(
                        'h-10 w-10 rounded-full flex items-center justify-center',
                        isDarkMode ? 'bg-primary/10' : 'bg-primary/5'
                      )}
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: 'easeInOut',
                      }}
                    >
                      <Globe className="h-5 w-5 text-primary/80" />
                    </motion.div>

                    <motion.div
                      className={cn(
                        'absolute -inset-1 rounded-full border',
                        isDarkMode ? 'border-primary/30' : 'border-primary/20'
                      )}
                      animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: 'easeInOut',
                      }}
                    />
                  </div>

                  <p className="mt-4 text-sm font-medium">Finding locations</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Please wait a moment
                  </p>
                </div>
              ) : results.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-muted-foreground text-sm">
                    No results found
                  </p>
                </div>
              ) : (
                <div>
                  {results.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                      className={cn(
                        'px-4 py-3 border-b last:border-0 cursor-pointer transition-all',
                        isDarkMode
                          ? 'border-muted/10 hover:bg-primary/5'
                          : 'border-muted/10 hover:bg-primary/5'
                      )}
                      onClick={() => onSelect(item.lat, item.lng)}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <h4
                            className={cn(
                              'font-medium text-sm truncate',
                              isDarkMode ? 'text-foreground' : ''
                            )}
                          >
                            {item.name}
                          </h4>
                          {(item.country || item.adminName) && (
                            <div
                              className={cn(
                                'flex items-center text-xs mt-1',
                                isDarkMode
                                  ? 'text-muted-foreground'
                                  : 'text-muted-foreground'
                              )}
                            >
                              <MapPin className="h-3 w-3 mr-1.5 flex-shrink-0 text-primary/70" />
                              <span className="truncate">
                                {[item.adminName, item.country]
                                  .filter(Boolean)
                                  .join(', ')}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center mt-2 gap-3">
                            {item.population && item.population > 0 && (
                              <div
                                className={cn(
                                  'flex items-center text-xs',
                                  isDarkMode
                                    ? 'text-muted-foreground/70'
                                    : 'text-muted-foreground/80'
                                )}
                              >
                                <User className="h-3 w-3 mr-1 flex-shrink-0 opacity-70" />
                                <span>
                                  {item.population >= 1000000
                                    ? `${(item.population / 1000000).toFixed(1)}M`
                                    : item.population >= 1000
                                      ? `${(item.population / 1000).toFixed(0)}K`
                                      : `${item.population}`}
                                </span>
                              </div>
                            )}

                            <div
                              className={cn(
                                'flex items-center text-xs',
                                isDarkMode
                                  ? 'text-muted-foreground/70'
                                  : 'text-muted-foreground/80'
                              )}
                            >
                              <Globe className="h-3 w-3 mr-1 flex-shrink-0 opacity-70" />
                              <span className="font-mono">
                                {item.lat.toFixed(2)}, {item.lng.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div
                          className={cn(
                            'mt-1 p-1.5 rounded-full',
                            isDarkMode
                              ? 'bg-primary/10 text-primary'
                              : 'bg-primary/5 text-primary'
                          )}
                        >
                          <MapPin className="h-4 w-4" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
