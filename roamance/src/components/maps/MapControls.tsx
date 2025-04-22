'use client';

import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Home, Minus, Navigation, Plus } from 'lucide-react';
import { useMap } from 'react-leaflet';

interface MapControlsProps {
  isDarkMode: boolean;
  onGetDirections?: () => void;
  hasUserLocation: boolean;
  onCenterUserLocation?: () => void;
}

export function MapControls({
  isDarkMode,
  onGetDirections,
  hasUserLocation,
  onCenterUserLocation,
}: MapControlsProps) {
  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <ZoomControls isDarkMode={isDarkMode} />

      {onGetDirections && hasUserLocation && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                'h-10 w-10 rounded-full backdrop-blur-md shadow-lg',
                isDarkMode
                  ? 'bg-card/90 border-primary/40 text-primary hover:bg-primary/30 hover:border-primary/60'
                  : 'bg-white/90 border-primary/40 text-primary/90 hover:bg-primary/10 hover:text-primary'
              )}
              onClick={onGetDirections}
            >
              <Navigation className={cn("h-5 w-5", isDarkMode ? "text-primary" : "")} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Get directions</p>
          </TooltipContent>
        </Tooltip>
      )}

      {onCenterUserLocation && hasUserLocation && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                'h-10 w-10 rounded-full backdrop-blur-md shadow-lg',
                isDarkMode
                  ? 'bg-card/90 border-primary/40 text-primary hover:bg-primary/30 hover:border-primary/60'
                  : 'bg-white/90 border-primary/40 text-primary/90 hover:bg-primary/10 hover:text-primary'
              )}
              onClick={onCenterUserLocation}
            >
              <Home className={cn("h-5 w-5", isDarkMode ? "text-primary" : "")} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Center on your location</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

function ZoomControls({ isDarkMode }: { isDarkMode: boolean }) {
  // This component needs to be inside MapContainer's context
  const ZoomButtons = () => {
    const map = useMap();

    const handleZoomIn = () => {
      map.zoomIn();
    };

    const handleZoomOut = () => {
      map.zoomOut();
    };

    return (
      <div className="flex flex-col gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                'h-8 w-8 rounded-full backdrop-blur-md shadow-lg',
                isDarkMode
                  ? 'bg-card/90 border-primary/40 text-primary hover:bg-primary/30 hover:border-primary/60'
                  : 'bg-white/90 border-primary/40 text-primary/90 hover:bg-primary/10 hover:text-primary'
              )}
              onClick={handleZoomIn}
            >
              <Plus className={cn("h-4 w-4", isDarkMode ? "text-primary" : "")} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Zoom in</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                'h-8 w-8 rounded-full backdrop-blur-md shadow-lg',
                isDarkMode
                  ? 'bg-card/90 border-primary/40 text-primary hover:bg-primary/30 hover:border-primary/60'
                  : 'bg-white/90 border-primary/40 text-primary/90 hover:bg-primary/10 hover:text-primary'
              )}
              onClick={handleZoomOut}
            >
              <Minus className={cn("h-4 w-4", isDarkMode ? "text-primary" : "")} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Zoom out</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  };

  return <ZoomButtons />;
}
