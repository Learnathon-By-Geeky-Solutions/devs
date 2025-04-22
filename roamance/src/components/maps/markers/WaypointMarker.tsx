'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import L from 'leaflet';
import { Eye, X } from 'lucide-react';
import { Marker, Popup } from 'react-leaflet';

interface WaypointMarkerProps {
  position: { lat: number; lng: number };
  index: number;
  isDarkMode: boolean;
  onRemove: () => void;
}

export function WaypointMarker({
  position,
  index,
  isDarkMode,
  onRemove,
}: WaypointMarkerProps) {
  return (
    <Marker
      position={[position.lat, position.lng]}
      icon={
        new L.Icon({
          iconUrl:
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAyNCAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDM2QzEyIDM2IDI0IDIzLjcyMyAyNCAxMkMyNCA1LjM3MjU4IDE4LjYyNzQgMCAxMiAwQzUuMzcyNTggMCAwIDUuMzcyNTggMCAxOEMwIDIzLjcyMyAxMiAzNiAxMiAzNloiIGZpbGw9IiM2MzY2RjEiLz4KPGNpcmxlIGN4PSIxMiIgY3k9IjEyIiByPSI2IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=',
          iconSize: [24, 36],
          iconAnchor: [12, 36],
          popupAnchor: [0, -36],
        })
      }
    >
      <Popup className={cn('rounded-lg shadow-lg', isDarkMode ? 'dark-popup' : '')}>
        <div className={cn('p-4 rounded-lg backdrop-blur-sm border border-opacity-20',
          isDarkMode ? 'bg-card/95 text-foreground border-white/10' : 'bg-white/95 border-black/10')}>
          <div className="space-y-1 mb-3">
            <div className="flex items-center">
              <span className={cn('inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-medium mr-2',
                isDarkMode ? 'bg-purple-400 text-gray-900' : 'bg-purple-100 text-purple-800')}>
                {index + 1}
              </span>
              <h3 className={cn('font-bold text-lg', isDarkMode ? 'text-foreground' : 'text-gray-900')}>
                Waypoint
              </h3>
            </div>
            <p className={cn('text-sm', isDarkMode ? 'text-muted-foreground' : 'text-gray-600')}>
              {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
            </p>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className={cn(
                    "flex-1 h-9 transition-all hover:translate-y-[-1px] font-medium gap-1.5",
                    isDarkMode
                      ? "border-purple-500/30 hover:bg-purple-500/10 text-purple-400"
                      : "border-purple-500/50 hover:bg-purple-500/5 text-purple-600"
                  )}
                  onClick={() => {
                    const mapElement = document.querySelector('.leaflet-map-pane')?.parentElement;

                    interface LeafletElement extends HTMLElement {
                      _leaflet_map: L.Map;
                    }

                    if (mapElement && 'leaflet' in mapElement) {
                      const map = (mapElement as unknown as LeafletElement)._leaflet_map;
                      if (map) {
                        map.setView([position.lat, position.lng], 16, { animate: true });
                      }
                    }
                  }}
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View this waypoint on map</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className={cn(
                    "flex-1 h-9 transition-all hover:translate-y-[-1px] font-medium gap-1.5 border-red-500/30",
                    isDarkMode
                      ? "hover:bg-red-500/10 text-red-400"
                      : "hover:bg-red-500/5 text-red-500"
                  )}
                  onClick={onRemove}
                >
                  <X className="h-4 w-4" />
                  <span>Remove</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove this waypoint from your route</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
