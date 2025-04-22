'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RouteData } from '@/types';
import { formatDistance } from '@/utils/format';
import { Clock, Navigation, PanelLeftClose } from 'lucide-react';
import { formatTravelTime } from './DirectionHelpers';

interface DirectionPanelHeaderProps {
  routeData: RouteData | null;
  isDarkMode: boolean;
  onClose: () => void;
}

export function DirectionPanelHeader({
  routeData,
  isDarkMode,
  onClose,
}: DirectionPanelHeaderProps) {
  return (
    <div
      className={cn(
        'rounded-xl p-4 bg-gradient-to-br shadow-sm',
        isDarkMode
          ? 'from-primary/20 to-ocean-dark/10 border border-primary/10'
          : 'from-ocean-light/20 to-primary/5 border border-ocean-light/20'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'p-2 rounded-full',
              isDarkMode
                ? 'bg-primary/30 shadow-inner'
                : 'bg-primary/20 shadow-sm'
            )}
          >
            <Navigation className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Your Journey</h2>
            {routeData && (
              <div className="flex items-center gap-2 mt-1 text-xs">
                <div
                  className={cn(
                    'rounded-full p-1',
                    isDarkMode ? 'bg-primary/20' : 'bg-primary/10'
                  )}
                >
                  <Clock className="h-3 w-3 text-primary" />
                </div>
                <span className="text-muted-foreground">
                  {formatTravelTime(routeData.summary.totalTime)}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {formatDistance(routeData.summary.totalDistance)}
                </span>
              </div>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full hover:bg-muted/20"
        >
          <PanelLeftClose className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
