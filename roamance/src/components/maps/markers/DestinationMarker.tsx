'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Icon, Map as LeafletMap } from 'leaflet';
import { Compass, Eye } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { createIcons } from './UserLocationMarker';

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), {
  ssr: false,
});

interface DestinationMarkerProps {
  position: { lat: number; lng: number };
  locationName: string;
  isDarkMode: boolean;
  userLocation?: { lat: number; lng: number } | null;
  directions?: boolean;
}

export function DestinationMarker({
  position,
  locationName,
  isDarkMode,
  userLocation,
  directions = false,
}: DestinationMarkerProps) {
  const [icon, setIcon] = useState<Icon | null>(null);

  useEffect(() => {
    createIcons().then(({ placeLocationIcon }) => {
      setIcon(placeLocationIcon);
    });
  }, []);

  if (!icon) {
    return null; // Or a loading indicator
  }

  return (
    <Marker position={[position.lat, position.lng]} icon={icon}>
      <Popup
        className={cn('rounded-lg shadow-lg', isDarkMode ? 'dark-popup' : '')}
      >
        <div
          className={cn(
            'p-4 rounded-lg backdrop-blur-sm border border-opacity-20',
            isDarkMode
              ? 'bg-card/95 text-foreground border-white/10'
              : 'bg-white/95 border-black/10'
          )}
        >
          <div className="space-y-1 mb-3">
            <h3
              className={cn(
                'font-bold text-lg',
                isDarkMode ? 'text-foreground' : 'text-gray-900'
              )}
            >
              {locationName}
            </h3>
            <p
              className={cn(
                'text-sm',
                isDarkMode ? 'text-muted-foreground' : 'text-gray-600'
              )}
            >
              {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
            </p>
          </div>

          {userLocation && !directions && (
            <div className="flex items-center gap-2 mt-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className={cn(
                      'flex-1 h-9 transition-all hover:translate-y-[-1px] font-medium gap-1.5',
                      isDarkMode
                        ? 'border-primary/30 hover:bg-primary/10 text-primary'
                        : 'border-primary/50 hover:bg-primary/5 text-primary'
                    )}
                    onClick={() => {
                      const event = new CustomEvent('getDirections');
                      window.dispatchEvent(event);
                    }}
                  >
                    <Compass className="h-4 w-4" />
                    <span>Directions</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Get directions from your location</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className={cn(
                      'flex-1 h-9 transition-all hover:translate-y-[-1px] font-medium gap-1.5',
                      isDarkMode
                        ? 'border-emerald-600/30 hover:bg-emerald-600/10 text-emerald-500'
                        : 'border-emerald-600/50 hover:bg-emerald-600/5 text-emerald-700'
                    )}
                    onClick={() => {
                      const mapElement =
                        document.querySelector(
                          '.leaflet-map-pane'
                        )?.parentElement;

                      interface LeafletElement extends HTMLElement {
                        _leaflet_map: LeafletMap;
                      }

                      if (mapElement && 'leaflet' in mapElement) {
                        const map = (mapElement as unknown as LeafletElement)
                          ._leaflet_map;
                        if (map) {
                          map.setView([position.lat, position.lng], 18, {
                            animate: true,
                          });
                        }
                      }
                    }}
                  >
                    <Eye className="h-4 w-4" />
                    <span>Street View</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View street-level imagery</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
