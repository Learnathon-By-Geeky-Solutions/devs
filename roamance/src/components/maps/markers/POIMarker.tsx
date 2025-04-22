'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import L from 'leaflet';
import { Eye, Plus } from 'lucide-react';
import { Marker, Popup } from 'react-leaflet';

interface POIMarkerProps {
  position: [number, number];
  name: string;
  category: string;
  icon: string;
  isDarkMode: boolean;
  onAddAsWaypoint?: () => void;
  directions?: boolean;
}

export function POIMarker({
  position,
  name,
  category,
  icon,
  isDarkMode,
  directions,
  onAddAsWaypoint,
}: POIMarkerProps) {
  return (
    <Marker
      position={position}
      icon={
        new L.DivIcon({
          html: `<div style="font-size: 18px; background-color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2);" title="${name}">${icon}</div>`,
          className: '',
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        })
      }
    >
      <Popup className={cn('rounded-lg shadow-lg', isDarkMode ? 'dark-popup' : '')}>
        <div className={cn('p-4 rounded-lg backdrop-blur-sm border border-opacity-20',
          isDarkMode ? 'bg-card/95 text-foreground border-white/10' : 'bg-white/95 border-black/10')}>
          <div className="space-y-1 mb-3">
            <h3 className={cn('font-bold text-lg', isDarkMode ? 'text-foreground' : 'text-gray-900')}>
              {name}
            </h3>
            <div className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
              isDarkMode ? 'bg-blue-900/30 text-blue-200' : 'bg-blue-100 text-blue-800')}>
              {category}
            </div>
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
                      ? "border-primary/30 hover:bg-primary/10 text-primary"
                      : "border-primary/50 hover:bg-primary/5 text-primary"
                  )}
                  onClick={() => {
                    const mapElement = document.querySelector('.leaflet-map-pane')?.parentElement;

                    interface LeafletElement extends HTMLElement {
                      _leaflet_map: L.Map;
                    }

                    if (mapElement && 'leaflet' in mapElement) {
                      const map = (mapElement as unknown as LeafletElement)._leaflet_map;
                      if (map) {
                        map.setView(position, 16);
                      }
                    }
                  }}
                >
                  <Eye className="h-4 w-4" />
                  <span>Details</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View details about this location</p>
              </TooltipContent>
            </Tooltip>

            {directions && onAddAsWaypoint && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className={cn(
                      "flex-1 h-9 transition-all hover:translate-y-[-1px] font-medium gap-1.5",
                      isDarkMode
                        ? "border-emerald-600/30 hover:bg-emerald-600/10 text-emerald-500"
                        : "border-emerald-600/50 hover:bg-emerald-600/5 text-emerald-700"
                    )}
                    onClick={onAddAsWaypoint}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Waypoint</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add this location as a stop on your route</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
