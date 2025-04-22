'use client';

import { cn } from '@/lib/utils';
import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';

interface UserLocationMarkerProps {
  position: { lat: number; lng: number };
  isDarkMode: boolean;
}

export function UserLocationMarker({
  position,
  isDarkMode,
}: UserLocationMarkerProps) {
  return (
    <Marker
      position={[position.lat, position.lng]}
      icon={
        new L.Icon({
          iconUrl:
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTUiIGZpbGw9IiMzQjgyRjYiIGZpbGwtb3BhY2l0eT0iMC4yIiBzdHJva2U9IiMzQjgyRjYiIHN0cm9rZS13aWR0aD0iMiIvPgo8Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSI2IiBmaWxsPSIjM0I4MkY2Ii8+Cjwvc3ZnPg==',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -8],
        })
      }
    >
      <Popup className={cn('rounded-lg shadow-lg', isDarkMode ? 'dark-popup' : '')}>
        <div className={cn('p-4 rounded-lg backdrop-blur-sm border border-opacity-20',
          isDarkMode ? 'bg-card/95 text-foreground border-white/10' : 'bg-white/95 border-black/10')}>
          <div className="pulse-dot mb-2.5">
            <div className={cn('w-3 h-3 rounded-full inline-block mr-2',
              isDarkMode ? 'bg-blue-500' : 'bg-blue-500')}></div>
            <h3 className={cn('font-bold text-lg inline',
              isDarkMode ? 'text-foreground' : 'text-gray-900')}>
              Your Location
            </h3>
          </div>
          <p className={cn('text-sm', isDarkMode ? 'text-muted-foreground' : 'text-gray-600')}>
            {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
          </p>
        </div>
      </Popup>
    </Marker>
  );
}
