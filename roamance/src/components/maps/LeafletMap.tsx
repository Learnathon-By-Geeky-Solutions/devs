'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import L from 'leaflet';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

// Import refactored components
import { MapControlButtons } from './MapControlButtons';
import { MapController } from './MapController';
import { MapFeatureHelp } from './MapFeatureHelp';
import { MapInternalControls } from './MapInternalControls';
import { mapLayerAttribution, mapLayers } from './MapLayerControl';
import { MapMarkersContainer } from './MapMarkersContainer';
import { MapSearchHandler } from './MapSearchHandler';
import { WaypointsPanel } from './WaypointsPanel';

// Import custom hooks
import { useMapFeatures } from '../../hooks/useMapFeatures';
import { useMapSearch } from '../../hooks/useMapSearch';
import { RouteData } from '@/types';

// Initialize Leaflet icons - moved to useEffect to avoid SSR issues
const initLeafletIcons = () => {
  delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/marker-icon-2x.png',
    iconUrl: '/marker-icon.png',
    shadowUrl: '/marker-shadow.png',
  });
};

// Add dark mode styles globally - moved to useEffect to avoid SSR issues
const addDarkModeStyles = () => {
  if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .dark-map .leaflet-tile-pane {
        filter: brightness(0.95) contrast(1.05) saturate(1.1);
      }
      .dark-map .leaflet-control,
      .dark-map .leaflet-control a {
        background-color: #1e1e1e !important;
        color: #f3f4f6 !important;
        border-color: #374151 !important;
      }
      .dark-map .leaflet-control a:hover {
        background-color: #374151 !important;
      }
      .dark-map .leaflet-popup-content-wrapper,
      .dark-map .leaflet-popup-tip {
        background-color: #1e1e1e !important;
        color: #f3f4f6 !important;
        border-color: #374151 !important;
      }
      .leaflet-draw-tooltip {
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(0, 0, 0, 0.5);
        color: #fff;
      }
      .dark-map .leaflet-draw-toolbar a {
        background-color: #1e1e1e !important;
        color: #f3f4f6 !important;
        border-color: #374151 !important;
      }
      .dark-map .leaflet-draw-actions a {
        background-color: #1e1e1e !important;
        color: #f3f4f6 !important;
        border-color: #374151 !important;
      }
    `;
    document.head.appendChild(styleElement);
  }
};

// Saint Martin Island coordinates as fallback
export const fallbackLocation = { lat: 20.6295, lng: 92.3208 };

interface LeafletMapProps {
  center: { lat: number; lng: number };
  destination: { lat: number; lng: number } | null;
  locationName: string;
  userLocation: { lat: number; lng: number; name?: string } | null;
  searchQuery: string;
  directions: boolean;
  onMapLoaded: () => void;
  isDarkMode: boolean;
  centerOnUser?: boolean;
  onRouteCalculated?: (routeData: RouteData) => void;
  isCustomStartPoint?: boolean;
  onSearchResultSelect?: (lat: number, lng: number, name: string) => void;
}

export default function LeafletMap({
  center,
  destination,
  locationName,
  userLocation,
  searchQuery,
  directions,
  onMapLoaded,
  isDarkMode,
  centerOnUser,
  onRouteCalculated,
  isCustomStartPoint = false,
  onSearchResultSelect,
}: LeafletMapProps) {
  // Initialize client-side only code
  useEffect(() => {
    // Initialize Leaflet icons
    initLeafletIcons();
    // Add dark mode styles
    addDarkModeStyles();
  }, []);

  // Use custom hooks for map features and search
  const { searchResults, isSearching, setSearchResults } =
    useMapSearch(searchQuery);

  const {
    currentMapLayer,
    setCurrentMapLayer,
    showTraffic,
    toggleTraffic,
    waypoints,
    setWaypoints,
    removeWaypoint,
    clearWaypoints,
    mapFeatureHelp,
    handleRouteCalculated,
  } = useMapFeatures();

  const mapRef = useRef<L.Map | null>(null);

  // Handle search result selection with callback to parent
  const handleSearchResultSelect = (lat: number, lng: number, name: string) => {
    if (onSearchResultSelect) {
      onSearchResultSelect(lat, lng, name);
    }
    setSearchResults([]);
  };

  // Route data calculation handler with callback to parent
  const routeCalculatedHandler = (routeData: RouteData) => {
    handleRouteCalculated(routeData, onRouteCalculated);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="h-full w-full relative">
        <MapContainer
          center={[
            center.lat || fallbackLocation.lat,
            center.lng || fallbackLocation.lng,
          ]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
          zoomControl={false}
          className={cn({ 'dark-map': isDarkMode })}
        >
          <TileLayer
            attribution={mapLayerAttribution[currentMapLayer]}
            url={
              isDarkMode
                ? mapLayers[currentMapLayer].dark
                : mapLayers[currentMapLayer].light
            }
          />

          {/* Map markers component */}
          <MapMarkersContainer
            destination={destination}
            locationName={locationName}
            userLocation={userLocation}
            isDarkMode={isDarkMode}
            isCustomStartPoint={isCustomStartPoint}
            directions={directions}
          />

          {/* Map Controller for route directions */}
          <MapController
            center={destination || center}
            userLocation={userLocation}
            directions={directions && !!destination}
            waypoints={waypoints}
            onMapLoaded={onMapLoaded}
            onRouteCalculated={routeCalculatedHandler}
            destination={destination}
            locationName={locationName}
          />

          {/* Components that require map context */}
          <MapInternalControls
            isDarkMode={isDarkMode}
            showTraffic={showTraffic}
            centerOnUser={centerOnUser}
            userLocation={userLocation}
          />
        </MapContainer>

        {/* Search results handler */}
        <MapSearchHandler
          results={searchResults}
          isSearching={isSearching}
          isDarkMode={isDarkMode}
          onSelect={handleSearchResultSelect}
          mapRef={mapRef}
        />

        {/* Map controls outside of MapContainer */}
        <MapControlButtons
          currentMapLayer={currentMapLayer}
          setCurrentMapLayer={setCurrentMapLayer}
          showTraffic={showTraffic}
          toggleTraffic={toggleTraffic}
          isDarkMode={isDarkMode}
          position={destination || center}
          locationName={locationName}
        />

        {/* Feature help component */}
        <MapFeatureHelp featureName={mapFeatureHelp} isDarkMode={isDarkMode} />

        {/* Waypoints panel */}
        {directions && waypoints.length > 0 && destination && (
          <WaypointsPanel
            waypoints={waypoints}
            removeWaypoint={removeWaypoint}
            setWaypoints={setWaypoints}
            clearWaypoints={clearWaypoints}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
