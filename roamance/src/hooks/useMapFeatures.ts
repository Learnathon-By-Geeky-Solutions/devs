import { useState, useEffect } from 'react';
import { mapLayers } from '../components/maps/MapLayerControl';
import { RouteData } from '../types'; // Fixed import path for RouteData

export interface Waypoint {
  lat: number;
  lng: number;
}

export function useMapFeatures() {
  const [currentMapLayer, setCurrentMapLayer] =
    useState<keyof typeof mapLayers>('standard');
  const [showTraffic, setShowTraffic] = useState<boolean>(false);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [mapFeatureHelp, setMapFeatureHelp] = useState<string | null>(null);

  // Toggle traffic overlay
  const toggleTraffic = () => {
    setShowTraffic(!showTraffic);
  };

  // Waypoints management
  const removeWaypoint = (index: number) => {
    const updatedWaypoints = [...waypoints];
    updatedWaypoints.splice(index, 1);
    setWaypoints(updatedWaypoints);
  };

  const clearWaypoints = () => {
    setWaypoints([]);
  };

  // Handle route data calculation
  const handleRouteCalculated = (
    routeData: RouteData,
    onRouteCalculated?: (routeData: RouteData) => void
  ) => {
    if (onRouteCalculated) {
      onRouteCalculated(routeData);
    }
  };

  // Event listeners for feature help
  useEffect(() => {
    const handleMapControlHover = (e: CustomEvent) => {
      setMapFeatureHelp(e.detail.feature);
    };

    const handleMapControlLeave = () => {
      setMapFeatureHelp(null);
    };

    window.addEventListener(
      'mapControlHover',
      handleMapControlHover as EventListener
    );
    window.addEventListener('mapControlLeave', handleMapControlLeave);

    return () => {
      window.removeEventListener(
        'mapControlHover',
        handleMapControlHover as EventListener
      );
      window.removeEventListener('mapControlLeave', handleMapControlLeave);
    };
  }, []);

  return {
    currentMapLayer,
    setCurrentMapLayer,
    showTraffic,
    toggleTraffic,
    waypoints,
    setWaypoints,
    removeWaypoint,
    clearWaypoints,
    mapFeatureHelp,
    setMapFeatureHelp,
    handleRouteCalculated
  };
}
