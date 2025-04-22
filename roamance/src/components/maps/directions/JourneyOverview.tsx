'use client';

import { cn } from '@/lib/utils';
import { RouteData } from '@/types';
import { formatDistance } from '@/utils/format';
import { Car, Map, Route, Timer } from 'lucide-react';
import { formatTravelTime } from './DirectionHelpers';

interface JourneyOverviewProps {
  routeData: RouteData;
  locationName: string;
  isDarkMode: boolean;
}

export function JourneyOverview({
  routeData,
  locationName,
  isDarkMode,
}: JourneyOverviewProps) {
  if (!routeData || !routeData.instructions || routeData.instructions.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'rounded-xl p-4 border transition-colors',
        isDarkMode
          ? 'bg-gradient-to-br from-forest-dark/20 to-background border-forest-dark/20'
          : 'bg-gradient-to-br from-forest-light/10 to-background border-forest-light/20'
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={cn(
            'h-7 w-7 rounded-full flex items-center justify-center',
            isDarkMode
              ? 'bg-forest-dark/30'
              : 'bg-forest-light/30'
          )}
        >
          <Route className="h-3.5 w-3.5 text-forest" />
        </div>
        <h3 className="text-sm font-medium">Journey Overview</h3>
      </div>

      <div className="flex items-start gap-3 bg-card/60 p-3 rounded-lg border border-muted/20">
        <Car className="h-4 w-4 text-sunset mt-0.5" />
        <div className="space-y-1 text-xs">
          <div>
            <span className="text-muted-foreground">From: </span>
            <span className="font-medium text-blue-500">
              Your location
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">To: </span>
            <span className="font-medium text-primary">
              {locationName}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 pt-1 border-t border-muted/10">
            <div className="flex items-center gap-1">
              <Map className="h-3 w-3 text-forest" />
              <span>
                {formatDistance(routeData.summary.totalDistance)}
              </span>
            </div>
            <span className="text-muted-foreground/50">•</span>
            <div className="flex items-center gap-1">
              <Timer className="h-3 w-3 text-sunset" />
              <span>{formatTravelTime(routeData.summary.totalTime)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
