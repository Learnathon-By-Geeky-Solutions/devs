'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface DarkModeMapLayerProps {
  isDarkMode: boolean;
}

export function DarkModeMapLayer({ isDarkMode }: DarkModeMapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (isDarkMode) {
      map.getContainer().classList.add('dark-map');
    } else {
      map.getContainer().classList.remove('dark-map');
    }
  }, [isDarkMode, map]);

  return null;
}
