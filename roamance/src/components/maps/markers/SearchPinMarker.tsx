'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import L from 'leaflet';
import { Eye, X } from 'lucide-react';
import { Marker, Popup } from 'react-leaflet';

interface SearchPinMarkerProps {
  position: { lat: number; lng: number };
  name: string;
  isDarkMode: boolean;
  onClear: () => void;
}

export function SearchPinMarker({
  position,
  name,
  isDarkMode,
  onClear,
}: SearchPinMarkerProps) {
  return (
    <Marker
      position={[position.lat, position.lng]}
      icon={
        new L.Icon({
          iconUrl:
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iNDUiIHZpZXdCb3g9IjAgMCAzMCA0NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE1IDQ0LjVDMTUgNDQuNSAzMCAyOS42NTQgMzAgMTVDMzAgNi43MTU3MyAyMy4yODQzIDAgMTUgMEM2LjcxNTczIDAgMCA2LjcxNTczIDAgMTVDMCAyOS42NTQgMTUgNDQuNSAxNSA0NC41WiIgZmlsbD0iIzNiODJmNiIvPgo8Y2lyY2xlIGN4PSIxNSIgY3k9IjE1IiByPSI3LjUiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg==',
          iconSize: [30, 45],
          iconAnchor: [15, 45],
          popupAnchor: [0, -45],
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
                      ? "border-blue-500/30 hover:bg-blue-500/10 text-blue-500"
                      : "border-blue-500/50 hover:bg-blue-500/5 text-blue-600"
                  )}
                  onClick={onClear}
                >
                  <X className="h-4 w-4" />
                  <span>Clear</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove this pin from the map</p>
              </TooltipContent>
            </Tooltip>

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
                  onClick={() => {
                    const mapElement = document.querySelector('.leaflet-map-pane')?.parentElement;

                    interface LeafletElement extends HTMLElement {
                      _leaflet_map: L.Map;
                    }

                    if (mapElement && 'leaflet' in mapElement) {
                      const map = (mapElement as unknown as LeafletElement)._leaflet_map;
                      if (map) {
                        map.setView([position.lat, position.lng], 18, { animate: true });
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
        </div>
      </Popup>
    </Marker>
  );
}
