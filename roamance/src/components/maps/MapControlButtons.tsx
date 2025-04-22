'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Moon, Ruler, Sun, TrafficCone } from 'lucide-react';
import { useTheme } from 'next-themes';
import { MapLayerControl } from './MapLayerControl';
import { ShareMapButton } from './ShareMapButton';

interface MapControlButtonsProps {
  currentMapLayer: 'standard' | 'satellite' | 'terrain' | 'transport';
  setCurrentMapLayer: (
    layer: 'standard' | 'satellite' | 'terrain' | 'transport'
  ) => void;
  showTraffic: boolean;
  toggleTraffic: () => void;
  isDarkMode: boolean;
  position: { lat: number; lng: number };
  locationName: string;
}

export function MapControlButtons({
  currentMapLayer,
  setCurrentMapLayer,
  showTraffic,
  toggleTraffic,
  isDarkMode,
  position,
  locationName,
}: MapControlButtonsProps) {
  const { setTheme, theme } = useTheme();

  // Helper function to emit hover events for contextual help
  const emitMapControlHover = (feature: string) => {
    const event = new CustomEvent('mapControlHover', { detail: { feature } });
    window.dispatchEvent(event);
  };

  const emitMapControlLeave = () => {
    const event = new CustomEvent('mapControlLeave');
    window.dispatchEvent(event);
  };

  return (
    <div className="absolute top-24 right-4 z-[1000] flex flex-col gap-3">
      <MapLayerControl
        currentLayer={currentMapLayer}
        setCurrentLayer={setCurrentMapLayer}
        isDarkMode={isDarkMode}
        onMouseEnter={() => emitMapControlHover('layers')}
        onMouseLeave={emitMapControlLeave}
      />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const event = new CustomEvent('toggle-measure');
              window.dispatchEvent(event);
            }}
            className={cn(
              'h-10 w-10 rounded-full backdrop-blur-md shadow-lg',
              isDarkMode
                ? 'bg-card/90 border-primary/40 text-primary hover:bg-primary/30 hover:border-primary/60'
                : 'bg-white/90 border-primary/40 text-primary/90 hover:bg-primary/10 hover:text-primary'
            )}
            onMouseEnter={() => emitMapControlHover('measure')}
            onMouseLeave={emitMapControlLeave}
          >
            <Ruler className={cn("h-4 w-4", isDarkMode ? "text-primary" : "")} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Measure distances</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={showTraffic ? 'default' : 'outline'}
            size="icon"
            onClick={toggleTraffic}
            className={cn(
              'h-10 w-10 rounded-full backdrop-blur-md shadow-lg',
              showTraffic
                ? 'bg-primary text-primary-foreground'
                : isDarkMode
                  ? 'bg-card/90 border-primary/40 text-primary hover:bg-primary/30 hover:border-primary/60'
                  : 'bg-white/90 border-primary/40 text-primary/90 hover:bg-primary/10 hover:text-primary'
            )}
            onMouseEnter={() => emitMapControlHover('traffic')}
            onMouseLeave={emitMapControlLeave}
          >
            <TrafficCone className={cn("h-5 w-5", isDarkMode && !showTraffic ? "text-primary" : "")} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{showTraffic ? 'Hide traffic' : 'Show traffic'}</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={cn(
              'h-10 w-10 rounded-full backdrop-blur-md shadow-lg relative overflow-hidden',
              isDarkMode
                ? 'bg-card/90 border-primary/40 text-primary hover:bg-primary/30 hover:border-primary/60'
                : 'bg-white/90 border-primary/40 text-primary/90 hover:bg-primary/10 hover:text-primary'
            )}
            onMouseEnter={() => emitMapControlHover('theme')}
            onMouseLeave={emitMapControlLeave}
          >
            <Sun className={cn("h-5 w-5 transition-all duration-300 rotate-0 scale-100 dark:-rotate-90 dark:scale-0", isDarkMode ? "text-primary" : "")} />
            <Moon className={cn("absolute h-5 w-5 transition-all duration-300 rotate-90 scale-0 dark:rotate-0 dark:scale-100", isDarkMode ? "text-primary" : "")} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle {isDarkMode ? 'light' : 'dark'} mode</p>
        </TooltipContent>
      </Tooltip>

      <ShareMapButton
        position={position}
        locationName={locationName}
        isDarkMode={isDarkMode}
        onMouseEnter={() => emitMapControlHover('share')}
        onMouseLeave={emitMapControlLeave}
      />
    </div>
  );
}
