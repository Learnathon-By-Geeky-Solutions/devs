'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isDarkMode: boolean;
}

export function SearchBar({ value, onChange, isDarkMode }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={cn(
        'w-full max-w-xl mx-auto relative transition-all duration-300',
        isFocused
          ? 'scale-[1.01]'
          : 'scale-100'
      )}
    >
      <div
        className={cn(
          'absolute inset-0 rounded-full transition-all duration-300',
          isFocused
            ? isDarkMode
              ? 'bg-primary/10 shadow-[0_0_0_2px_rgba(56,189,248,0.2),0_0_15px_rgba(56,189,248,0.15)]'
              : 'bg-white shadow-[0_0_0_2px_rgba(56,189,248,0.2),0_0_20px_rgba(56,189,248,0.15)]'
            : isDarkMode
              ? 'bg-muted/30 shadow-sm'
              : 'bg-white/80 shadow-sm'
        )}
      />

      <div className="relative flex items-center">
        <Search
          className={cn(
            'absolute left-4 h-4 w-4 transition-all duration-300',
            isFocused
              ? 'text-primary'
              : isDarkMode
                ? 'text-muted-foreground/70'
                : 'text-muted-foreground/60'
          )}
        />

        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search for places, cities, or landmarks..."
          className={cn(
            'pl-11 pr-10 h-12 border-0 bg-transparent rounded-full text-sm',
            isDarkMode
              ? 'placeholder:text-muted-foreground/50'
              : 'placeholder:text-muted-foreground/60'
          )}
        />

        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-4"
              onClick={() => onChange('')}
              aria-label="Clear search"
            >
              <div className={cn(
                'p-1.5 rounded-full transition-colors',
                isDarkMode
                  ? 'hover:bg-muted/50'
                  : 'hover:bg-muted/30'
              )}>
                <X className={cn(
                  'h-3.5 w-3.5',
                  isDarkMode ? 'text-muted-foreground' : 'text-muted-foreground/70'
                )} />
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
