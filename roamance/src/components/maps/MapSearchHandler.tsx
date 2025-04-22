'use client';

import React from 'react';
import { SearchResults } from './SearchResults';
import { SearchResult } from '../../hooks/useMapSearch';

interface MapSearchHandlerProps {
  results: SearchResult[];
  isSearching: boolean;
  isDarkMode: boolean;
  onSelect: (lat: number, lng: number, name: string) => void;
  mapRef: React.MutableRefObject<L.Map | null>;
}

export function MapSearchHandler({
  results,
  isSearching,
  isDarkMode,
  onSelect,
  mapRef
}: MapSearchHandlerProps) {
  const handleSelectSearchResult = (lat: number, lng: number) => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 15);

      // Find the selected result
      const selectedResult = results.find(
        (r) => r.lat === lat && r.lng === lng
      );

      if (selectedResult) {
        // Use the callback to set this as the destination
        onSelect(lat, lng, selectedResult.name);
      }
    }
  };

  return (
    <SearchResults
      results={results}
      onSelect={handleSelectSearchResult}
      isDarkMode={isDarkMode}
      isSearching={isSearching}
    />
  );
}
