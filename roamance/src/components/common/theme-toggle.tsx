'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className={cn(
        'rounded-full transition-colors duration-300 cursor-pointer group',
        className
      )}
    >
      <Sun className="h-[18px] w-[18px] transition-all duration-300 ease-in-out rotate-0 scale-100 dark:-rotate-90 dark:scale-0 group-hover:text-amber-400 group-hover:rotate-180" />
      <Moon className="absolute h-[18px] w-[18px] transition-all duration-300 ease-in-out rotate-90 scale-0 dark:rotate-0 dark:scale-100 group-hover:text-primary" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
