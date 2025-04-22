'use client';

import React from 'react';
import {
  CustomStartPointMarker,
  DestinationMarker,
  UserLocationMarker
} from './MapMarkers';

interface MapMarkersContainerProps {
  destination: { lat: number; lng: number } | null;
  locationName: string;
  userLocation: { lat: number; lng: number; name?: string } | null;
  isDarkMode: boolean;
  isCustomStartPoint: boolean;
  directions: boolean;
}

export function MapMarkersContainer({
  destination,
  locationName,
  userLocation,
  isDarkMode,
  isCustomStartPoint,
  directions
}: MapMarkersContainerProps) {
  return (
    <>
      {/* Destination marker - only show if destination exists */}
      {destination && (
        <DestinationMarker
          position={destination}
          locationName={locationName}
          isDarkMode={isDarkMode}
          userLocation={userLocation}
          directions={directions}
        />
      )}

      {/* Show user location marker only if not using custom starting point */}
      {userLocation && !isCustomStartPoint && (
        <UserLocationMarker
          position={userLocation}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Show custom start point marker if applicable */}
      {userLocation && isCustomStartPoint && (
        <CustomStartPointMarker
          position={userLocation}
          name={userLocation.name || 'Custom Start'}
          isDarkMode={isDarkMode}
        />
      )}
    </>
  );
}
