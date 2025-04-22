'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

interface WaypointsPanelProps {
  waypoints: Array<{ lat: number; lng: number }>;
  removeWaypoint: (index: number) => void;
  clearWaypoints: () => void;
  isDarkMode: boolean;
  setWaypoints?: Dispatch<SetStateAction<Array<{ lat: number; lng: number }>>>;
}

export function WaypointsPanel({
  waypoints,
  removeWaypoint,
  clearWaypoints,
  isDarkMode,
}: WaypointsPanelProps) {
  if (waypoints.length === 0) return null;

  return (
    <Card
      className={cn(
        'absolute left-4 bottom-20 z-[1000] p-4 max-w-xs backdrop-blur-md border',
        isDarkMode
          ? 'bg-card/80 border-card-foreground/10'
          : 'bg-white/90 border-muted'
      )}
    >
      <h3 className="font-medium text-sm mb-2">
        Waypoints ({waypoints.length})
      </h3>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {waypoints.map((wp, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-xs"
          >
            <span>Waypoint {index + 1}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 p-0"
                  onClick={() => removeWaypoint(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove waypoint {index + 1}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        ))}
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            className="w-full mt-2"
            onClick={clearWaypoints}
          >
            Clear All
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Remove all waypoints from route</p>
        </TooltipContent>
      </Tooltip>
    </Card>
  );
}
