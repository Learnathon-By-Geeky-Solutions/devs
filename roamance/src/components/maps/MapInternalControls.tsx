'use client';

import { useEffect, useState, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { DarkModeMapLayer } from './DarkModeMapLayer';
import { MeasurementTools } from './MeasurementControl';
import { TrafficLayer } from './TrafficControl';

interface MapInternalControlsProps {
  isDarkMode: boolean;
  showTraffic: boolean;
  centerOnUser?: boolean;
  userLocation?: { lat: number; lng: number } | null;
}

export function MapInternalControls({
  isDarkMode,
  showTraffic,
  centerOnUser,
  userLocation,
}: MapInternalControlsProps) {
  const map = useMap();
  const [isMeasuring, setIsMeasuring] = useState(false);
  const previousCenterOnUser = useRef(centerOnUser);
  const userLocationCentered = useRef(false);

  useEffect(() => {
    if (centerOnUser && !previousCenterOnUser.current && userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 15, {
        animate: true,
        duration: 1,
      });

      userLocationCentered.current = true;

      const event = new CustomEvent('userLocationCentered');
      window.dispatchEvent(event);
    } else if (!centerOnUser && previousCenterOnUser.current) {
      userLocationCentered.current = false;
    }

    previousCenterOnUser.current = centerOnUser;
  }, [centerOnUser, map, userLocation]);

  useEffect(() => {
    const originalSetView = map.setView;

    map.setView = function (...args) {
      if (userLocationCentered.current) {
        const [, zoom, options] = args;

        if (zoom !== undefined) {
          const currentCenter = map.getCenter();
          return originalSetView.call(
            this,
            [currentCenter.lat, currentCenter.lng],
            zoom,
            options
          );
        }

        return this;
      }

      return originalSetView.apply(this, args);
    };

    return () => {
      map.setView = originalSetView;
    };
  }, [map]);

  useEffect(() => {
    const handleToggleMeasure = () => {
      setIsMeasuring((prev) => !prev);
    };

    window.addEventListener('toggle-measure', handleToggleMeasure);

    return () => {
      window.removeEventListener('toggle-measure', handleToggleMeasure);
    };
  }, []);

  return (
    <>
      <DarkModeMapLayer isDarkMode={isDarkMode} />
      {showTraffic && <TrafficLayer isDarkMode={isDarkMode} />}
      {isMeasuring && <MeasurementTools />}
    </>
  );
}
