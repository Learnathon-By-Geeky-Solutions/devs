'use client';

import { LeafletMap } from '@/components/maps';

interface MapProps {
  center: { lat: number; lng: number };
  destination: { lat: number; lng: number } | null;
  locationName: string;
  userLocation: { lat: number; lng: number } | null;
  searchQuery: string;
  directions: boolean;
  onMapLoaded: () => void;
  isDarkMode: boolean;
  centerOnUser?: boolean;
}

export default function MapComponent({
  center,
  destination,
  locationName,
  userLocation,
  searchQuery,
  directions,
  onMapLoaded,
  isDarkMode,
  centerOnUser,
}: MapProps) {
  // This component now simply passes props to the refactored LeafletMap component
  return (
    <LeafletMap
      center={center}
      destination={destination}
      locationName={locationName}
      userLocation={userLocation}
      searchQuery={searchQuery}
      directions={directions}
      onMapLoaded={onMapLoaded}
      isDarkMode={isDarkMode}
      centerOnUser={centerOnUser}
    />
  );
}
