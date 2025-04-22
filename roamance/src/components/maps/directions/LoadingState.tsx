'use client';

import { cn } from '@/lib/utils';
import { Route } from 'lucide-react';

interface LoadingStateProps {
  isDarkMode: boolean;
}

export function LoadingState({ isDarkMode }: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center space-y-3 p-6 mt-3 rounded-xl border',
        isDarkMode
          ? 'border-muted/20 bg-card/20'
          : 'border-muted/30 bg-muted/5'
      )}
    >
      <div className="animate-pulse flex items-center justify-center h-12 w-12 rounded-full bg-muted/20">
        <Route className="h-6 w-6 text-muted-foreground/30" />
      </div>
      <p className="text-sm text-muted-foreground text-center">
        Calculating your route...
        <br />
        Please wait a moment.
      </p>
      <div className="w-16 h-1 rounded-full bg-muted/20"></div>
    </div>
  );
}
