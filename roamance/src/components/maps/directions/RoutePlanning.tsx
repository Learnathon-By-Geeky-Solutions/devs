'use client';

import { searchGeonames } from '@/api/places-api';
import { cn } from '@/lib/utils';
import { Geoname } from '@/types/places';
import { Compass, Flag, LocateFixed } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LocationSearchInput } from './LocationSearchInput';
import { SearchResultsList } from './SearchResultsList';

interface RoutePlanningProps {
  isDarkMode: boolean;
  locationName: string;
  onChangeStartPoint?: (lat: number, lng: number, name: string) => void;
  onChangeDestination?: (lat: number, lng: number, name: string) => void;
  setActiveStep: (step: number | null) => void;
}

export function RoutePlanning({
  isDarkMode,
  locationName,
  onChangeStartPoint,
  onChangeDestination,
  setActiveStep,
}: RoutePlanningProps) {
  const [startPointSearch, setStartPointSearch] = useState<string>('');
  const [destinationSearch, setDestinationSearch] = useState<string>('');
  const [startPointResults, setStartPointResults] = useState<Geoname[]>([]);
  const [destinationResults, setDestinationResults] = useState<Geoname[]>([]);
  const [isSearchingStart, setIsSearchingStart] = useState<boolean>(false);
  const [isSearchingDestination, setIsSearchingDestination] = useState<boolean>(false);
  const [showStartResults, setShowStartResults] = useState<boolean>(false);
  const [showDestResults, setShowDestResults] = useState<boolean>(false);

  // Search for starting point locations
  useEffect(() => {
    if (startPointSearch.length < 3) {
      setStartPointResults([]);
      setShowStartResults(false);
      return;
    }

    const fetchStartPointResults = async () => {
      setIsSearchingStart(true);
      try {
        const results = await searchGeonames(startPointSearch, 5);
        setStartPointResults(results);
        setShowStartResults(true);
      } catch (error) {
        console.error('Error searching for starting points:', error);
      } finally {
        setIsSearchingStart(false);
      }
    };

    const timer = setTimeout(() => {
      fetchStartPointResults();
    }, 500);

    return () => clearTimeout(timer);
  }, [startPointSearch]);

  // Search for destination locations
  useEffect(() => {
    if (destinationSearch.length < 3) {
      setDestinationResults([]);
      setShowDestResults(false);
      return;
    }

    const fetchDestinationResults = async () => {
      setIsSearchingDestination(true);
      try {
        const results = await searchGeonames(destinationSearch, 5);
        setDestinationResults(results);
        setShowDestResults(true);
      } catch (error) {
        console.error('Error searching for destinations:', error);
      } finally {
        setIsSearchingDestination(false);
      }
    };

    const timer = setTimeout(() => {
      fetchDestinationResults();
    }, 500);

    return () => clearTimeout(timer);
  }, [destinationSearch]);

  // Handle selection of starting point
  const handleSelectStartPoint = (geoname: Geoname) => {
    if (onChangeStartPoint) {
      onChangeStartPoint(
        parseFloat(geoname.lat),
        parseFloat(geoname.lng),
        geoname.toponymName || geoname.name
      );
      setStartPointSearch(geoname.toponymName || geoname.name);
    }
    setShowStartResults(false);
    // Reset active step when changing route
    setActiveStep(null);
  };

  // Handle selection of destination
  const handleSelectDestination = (geoname: Geoname) => {
    if (onChangeDestination) {
      onChangeDestination(
        parseFloat(geoname.lat),
        parseFloat(geoname.lng),
        geoname.toponymName || geoname.name
      );
      setDestinationSearch(geoname.toponymName || geoname.name);
    }
    setShowDestResults(false);
    // Reset active step when changing route
    setActiveStep(null);
  };

  return (
    <div
      className={cn(
        'rounded-xl p-4 border mb-3',
        isDarkMode
          ? 'border-muted/40 bg-gradient-to-br from-background/80 to-muted/5'
          : 'border-muted/30 bg-gradient-to-br from-background/90 to-muted/10'
      )}
    >
      <h3 className="text-sm font-medium flex items-center gap-2 mb-4 text-muted-foreground">
        <Compass className="h-4 w-4" />
        Route Planning
      </h3>

      <div className="space-y-4">
        {/* Starting Point Search */}
        <div className="relative">
          <LocationSearchInput
            label="Starting Point"
            iconColor="text-blue-500"
            iconBgColor="bg-blue-500"
            icon={<LocateFixed className="h-3 w-3 text-white" />}
            value={startPointSearch}
            onChange={setStartPointSearch}
            isSearching={isSearchingStart}
            isDarkMode={isDarkMode}
            placeholder="Search starting point..."
            currentLocationName="Your current location"
            ringColor="ring-blue-500/50"
          />

          {/* Starting point search results */}
          {showStartResults && (
            <SearchResultsList
              results={startPointResults}
              onSelectResult={handleSelectStartPoint}
              isDarkMode={isDarkMode}
              accentColor="text-blue-500"
            />
          )}
        </div>

        {/* Connector between points */}
        <div className="flex items-center justify-center py-1">
          <div className={cn('flex flex-col items-center gap-1')}>
            <div
              className={cn(
                'h-5 w-0.5 rounded-full',
                isDarkMode ? 'bg-muted/70' : 'bg-muted/60'
              )}
            ></div>
            <div
              className={cn(
                'h-5 w-5 rounded-full flex items-center justify-center',
                isDarkMode
                  ? 'bg-primary/20 border border-primary/40'
                  : 'bg-muted/40 border border-muted/50'
              )}
            >
              <Flag className={cn(
                'h-3 w-3',
                isDarkMode
                  ? 'text-primary/90'
                  : 'text-muted-foreground'
              )} />
            </div>
            <div
              className={cn(
                'h-5 w-0.5 rounded-full',
                isDarkMode ? 'bg-muted/70' : 'bg-muted/60'
              )}
            ></div>
          </div>
        </div>

        {/* Destination Search */}
        <div className="relative">
          <LocationSearchInput
            label="Destination"
            iconColor="text-primary"
            iconBgColor="bg-primary"
            icon={<Flag className="h-3 w-3 text-primary-foreground" />}
            value={destinationSearch}
            onChange={setDestinationSearch}
            isSearching={isSearchingDestination}
            isDarkMode={isDarkMode}
            placeholder="Search destination..."
            currentLocationName={locationName}
          />

          {/* Destination search results */}
          {showDestResults && (
            <SearchResultsList
              results={destinationResults}
              onSelectResult={handleSelectDestination}
              isDarkMode={isDarkMode}
            />
          )}
        </div>
      </div>
    </div>
  );
}
