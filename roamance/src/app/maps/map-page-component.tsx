'use client';

import { MapFeaturesInfo } from '@/components/maps';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MapPageHeader } from '@/components/maps/MapPageHeader';
import { SearchSection } from '@/components/maps/SearchSection';
import { DirectionsPanel } from '@/components/maps/DirectionsPanel';
import { RouteData } from '@/types';
import dynamic from 'next/dynamic';

// Dynamically import the MapContainer component with SSR disabled
const MapContainer = dynamic(
  () => import('./map-container').then(mod => mod.MapContainer),
  { ssr: false } // This ensures the component only renders on the client side
);

// Saint Martin Island, Bangladesh coordinates
const defaultCenter = { lat: 20.6295, lng: 92.3208 };

export function MapPage() {
  const searchParams = useSearchParams();
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  // Destination state - can be null when no destination is selected
  const [destination, setDestination] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationName, setLocationName] = useState('');
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [customStartPoint, setCustomStartPoint] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(null);
  const [directions, setDirections] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDirectionsPanel, setShowDirectionsPanel] = useState(false);
  const [centerOnUser, setCenterOnUser] = useState(false);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter); // For map centering, separate from destination

  useEffect(() => {
    const lat = searchParams?.get('lat');
    const lng = searchParams?.get('lng');
    const name = searchParams?.get('name') || 'Selected Location';
    const dir = searchParams?.get('dir') === 'true';

    if (lat && lng) {
      const newDestination = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      };
      setDestination(newDestination);
      setMapCenter(newDestination);
      setLocationName(name);
      setDirections(dir);
    } else {
      // No destination from URL parameters
      setDestination(null);
      setMapCenter(defaultCenter); // Default map center for visualization
      setLocationName('');
    }
  }, [searchParams]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocationData = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userLocationData);

          // If no URL parameters were provided, center the map on user's location
          if (!searchParams?.get('lat') && !searchParams?.get('lng')) {
            setMapCenter(userLocationData);
          }
        },
        (error) => {
          console.error('Error getting location', error);
        }
      );
    }
  }, [searchParams]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleGetDirections = () => {
      setDirections(true);
      setShowDirectionsPanel(true);
    };

    window.addEventListener('getDirections', handleGetDirections);

    return () => {
      window.removeEventListener('getDirections', handleGetDirections);
    };
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleCenterOnUser = () => {
    if (userLocation) {
      setCenterOnUser(true);
      setMapCenter(userLocation);

      setTimeout(() => {
        setCenterOnUser(false);
      }, 500);
    }
  };

  const handleRouteCalculated = (data: RouteData) => {
    setRouteData(data);
    setShowDirectionsPanel(true);
  };

  const toggleDirectionsPanel = () => {
    setShowDirectionsPanel(!showDirectionsPanel);
  };

  const handleChangeStartPoint = (lat: number, lng: number, name: string) => {
    setCustomStartPoint({ lat, lng, name });
    // Reset route data so it gets recalculated
    setRouteData(null);
  };

  const handleChangeDestination = (lat: number, lng: number, name: string) => {
    setDestination({ lat, lng });
    setMapCenter({ lat, lng });
    setLocationName(name);
    // Reset route data so it gets recalculated
    setRouteData(null);
  };

  // Handle search result selection as destination
  const handleSearchResultSelected = (
    lat: number,
    lng: number,
    name: string
  ) => {
    setDestination({ lat, lng });
    setMapCenter({ lat, lng });
    setLocationName(name);
    // Clear search results after selection
    setSearchQuery('');
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <div
        className={cn(
          'absolute inset-0 -z-10',
          isDarkMode
            ? 'bg-gradient-to-br from-background to-background/90'
            : 'bg-gradient-to-br from-sky-50/80 via-blue-50/50 to-white'
        )}
      />

      <MapPageHeader
        isDarkMode={isDarkMode}
        userLocation={userLocation}
        directions={directions}
        showDirectionsPanel={showDirectionsPanel}
        handleCenterOnUser={handleCenterOnUser}
        toggleDirectionsPanel={toggleDirectionsPanel}
      />

      <SearchSection
        isDarkMode={isDarkMode}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      <div className="flex-1 relative overflow-hidden">
        <MapContainer
          center={mapCenter}
          destination={destination}
          locationName={locationName}
          userLocation={customStartPoint || userLocation}
          searchQuery={searchQuery}
          directions={directions}
          isDarkMode={isDarkMode}
          centerOnUser={centerOnUser}
          onRouteCalculated={handleRouteCalculated}
          isCustomStartPoint={!!customStartPoint}
          onSearchResultSelect={handleSearchResultSelected}
        />

        <AnimatePresence>
          {directions && showDirectionsPanel && destination && (
            <DirectionsPanel
              routeData={routeData}
              locationName={locationName}
              isDarkMode={isDarkMode}
              showDirectionsPanel={showDirectionsPanel}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              onClose={toggleDirectionsPanel}
              onChangeStartPoint={handleChangeStartPoint}
              onChangeDestination={handleChangeDestination}
            />
          )}
        </AnimatePresence>
      </div>

      <MapFeaturesInfo isDarkMode={isDarkMode} />
    </div>
  );
}
