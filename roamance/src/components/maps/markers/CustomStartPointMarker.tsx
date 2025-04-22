'use client';

import { cn } from '@/lib/utils';
import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';

interface CustomStartPointMarkerProps {
  position: { lat: number; lng: number };
  name: string;
  isDarkMode: boolean;
}

export function CustomStartPointMarker({
  position,
  name,
  isDarkMode,
}: CustomStartPointMarkerProps) {
  return (
    <Marker
      position={[position.lat, position.lng]}
      icon={
        new L.Icon({
          iconUrl:
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iNDUiIHZpZXdCb3g9IjAgMCAzMCA0NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE1IDQ0LjVDMTUgNDQuNSAzMCAyOS42NTQgMzAgMTVDMzAgNi43MTU3MyAyMy4yODQzIDAgMTUgMEM2LjcxNTczIDAgMCA2LjcxNTczIDAgMTVDMCAyOS42NTQgMTUgNDQuNSAxNSA0NC41WiIgZmlsbD0iIzEwQjk4MSIvPgo8Y2lyY2xlIGN4PSIxNSIgY3k9IjE1IiByPSI3LjUiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg==',
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
            <div className="flex items-center gap-1.5">
              <div className={cn('w-2.5 h-2.5 rounded-full',
                isDarkMode ? 'bg-emerald-400' : 'bg-emerald-500')}></div>
              <h3 className={cn('font-bold text-lg',
                isDarkMode ? 'text-foreground' : 'text-gray-900')}>
                Starting Point
              </h3>
            </div>
            <p className={cn('text-sm font-medium',
              isDarkMode ? 'text-muted-foreground' : 'text-gray-700')}>
              {name}
            </p>
            <p className={cn('text-xs', isDarkMode ? 'text-muted-foreground' : 'text-gray-600')}>
              {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
            </p>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
