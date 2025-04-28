'use client';

import { cn } from '@/lib/utils';
import { Location } from '@/types/location';
import { Control } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import { formatDistance } from './MeasurementControl';
import { createIcons } from './markers/UserLocationMarker';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), {
  ssr: false,
});

// Type definitions for dynamically imported modules
type LeafletType = typeof import('leaflet');

interface RouteVisualizationProps {
  /**
   * Array of locations that make up the route
   */
  locations: Location[];

  /**
   * Names for each location point (optional)
   * If provided, the array length should match locations array
   */
  locationNames?: string[];

  /**
   * Height of the map container
   * @default '400px'
   */
  height?: string;

  /**
   * Width of the map container
   * @default '100%'
   */
  width?: string;

  /**
   * Additional class names for the container
   */
  className?: string;

  /**
   * Whether to show distance information
   * @default true
   */
  showDistance?: boolean;

  /**
   * Whether to automatically fit the map to show all route points
   * @default true
   */
  autoFit?: boolean;

  /**
   * Starting zoom level before auto-fit
   * @default 13
   */
  zoom?: number;

  /**
   * Custom styles for the route line
   */
  routeStyle?: {
    color?: string;
    weight?: number;
    opacity?: number;
    dashArray?: string;
  };

  /**
   * Indicator showing the current user location on the map
   */
  userLocation?: Location;

  /**
   * Whether to highlight the start and end points differently
   * @default true
   */
  highlightEndpoints?: boolean;

  /**
   * Average speed in km/h for travel time calculation
   * - walking: 5 km/h
   * - cycling: 15 km/h
   * - driving: 60 km/h
   * - custom: specify your own value
   * @default 'driving'
   */
  travelMode?: 'walking' | 'cycling' | 'driving' | number;

  /**
   * Whether to show the travel time estimate
   * @default true
   */
  showTravelTime?: boolean;
}

// Travel speeds in km/h for different travel modes
const TRAVEL_SPEEDS = {
  walking: 5,
  cycling: 15,
  driving: 60,
};

/**
 * A component that automatically fits the map view to show all route points
 */
function FitBoundsToRoute({
  locations,
  L,
}: {
  locations: Location[];
  L: LeafletType;
}) {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = new L.LatLngBounds(
        locations.map((loc) => [loc.latitude, loc.longitude])
      );
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [locations, map, L]);

  return null;
}

/**
 * Formats time in hours and minutes
 * @param timeInHours Time in hours (can be decimal)
 */
function formatTime(timeInHours: number): string {
  if (timeInHours < 0.016) {
    // Less than 1 minute
    return 'Less than a minute';
  }

  const hours = Math.floor(timeInHours);
  const minutes = Math.round((timeInHours - hours) * 60);

  if (hours === 0) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  } else if (minutes === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  } else {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  }
}

/**
 * A component that renders the actual route between points using Leaflet Routing Machine
 */
function RoutingMachineLayer({
  locations,
  routeStyle,
  onRouteFound,
  L,
}: {
  locations: Location[];
  routeStyle?: {
    color?: string;
    weight?: number;
    opacity?: number;
  };
  onRouteFound?: (distance: number, time: number) => void;
  L: LeafletType;
}) {
  const map = useMap();
  const routingControlRef = useRef<Control | null>(null);

  useEffect(() => {
    if (locations.length < 2) return;

    // Clean up previous routing control if it exists
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    // Create waypoints from locations
    const waypoints = locations.map((loc) =>
      L.latLng(loc.latitude, loc.longitude)
    );

    // Create new routing control
    const routingControl = L.Routing.control({
      waypoints,
      show: false, // Don't show the routing control UI
      addWaypoints: false, // Disable adding new waypoints by clicking
      routeWhileDragging: false,
      lineOptions: {
        styles: [
          {
            color: routeStyle?.color || '#4f46e5',
            weight: routeStyle?.weight || 4,
            opacity: routeStyle?.opacity || 0.8,
          },
        ],
        extendToWaypoints: true,
        missingRouteTolerance: 0,
      },
      //@ts-expect-error handling the makers separately
      createMarker: () => {
        return null;
      }, // Don't create markers (we handle them separately)
    }).addTo(map);

    // Listen for the 'routesfound' event to get actual route data
    routingControl.on('routesfound', (e) => {
      if (e.routes && e.routes.length > 0) {
        const route = e.routes[0];
        const totalDistance = route.summary.totalDistance; // in meters
        const totalTime = route.summary.totalTime; // in seconds

        if (onRouteFound) {
          onRouteFound(totalDistance, totalTime / 60); // Convert time to minutes
        }
      }
    });

    // Save reference to the routing control
    routingControlRef.current = routingControl;

    // Clean up on component unmount
    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [locations, map, routeStyle, onRouteFound, L]);

  return null;
}

/**
 * A component that displays route information in the top right corner of the map
 */
function RouteInfoControl({
  distance,
  time,
  hasActualRoute,
  L,
}: {
  distance: number;
  time: number;
  hasActualRoute: boolean;
  L: LeafletType;
}) {
  const map = useMap();
  const isDarkMode = useTheme().resolvedTheme === 'dark';
  const controlRef = useRef<L.Control | null>(null);

  useEffect(() => {
    if (controlRef.current) {
      controlRef.current.remove();
    }

    // Create a custom control for the route info
    const RouteInfoControl = L.Control.extend({
      options: {
        position: 'topright',
      },
      onAdd: function () {
        const container = L.DomUtil.create(
          'div',
          'leaflet-bar leaflet-control route-info-control'
        );
        container.style.padding = '8px 12px';
        container.style.background = isDarkMode
          ? 'rgba(30, 30, 30, 0.85)'
          : 'rgba(255, 255, 255, 0.9)';
        container.style.borderRadius = '8px';
        container.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
        container.style.margin = '10px';
        container.style.fontSize = '14px';
        container.style.color = isDarkMode ? '#e5e5e5' : '#333';
        container.style.backdropFilter = 'blur(4px)';
        container.style.border = isDarkMode
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid rgba(0, 0, 0, 0.1)';

        // Distance info
        const distanceDiv = L.DomUtil.create('div', '', container);
        distanceDiv.innerHTML = `<strong>Distance:</strong> ${formatDistance(distance)}`;
        distanceDiv.style.marginBottom = '4px';

        // Time info
        const timeDiv = L.DomUtil.create('div', '', container);
        timeDiv.innerHTML = `<strong>Est. time:</strong> ${formatTime(time)}`;

        // Indication that this is road distance/time (if applicable)
        if (hasActualRoute) {
          const sourceDiv = L.DomUtil.create('div', '', container);
          sourceDiv.innerHTML = `<span style="font-size: 11px; opacity: 0.8; font-style: italic;">Based on road route</span>`;
          sourceDiv.style.marginTop = '4px';
        }

        L.DomEvent.disableClickPropagation(container);
        return container;
      },
    });

    // Add the control to the map
    controlRef.current = new RouteInfoControl().addTo(map);

    return () => {
      if (controlRef.current) {
        controlRef.current.remove();
      }
    };
  }, [map, distance, time, hasActualRoute, isDarkMode, L.Control, L.DomUtil, L.DomEvent]);

  return null;
}

/**
 * A component that visualizes a route with markers for each location point
 */
export function RouteVisualization({
  locations,
  locationNames,
  height = '400px',
  width = '100%',
  className,
  showDistance = true,
  autoFit = true,
  zoom = 13,
  routeStyle,
  userLocation,
  highlightEndpoints = true,
  travelMode = 'driving',
  showTravelTime = true,
}: RouteVisualizationProps) {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [hasActualRoute, setHasActualRoute] = useState<boolean>(false);

  // State for dynamically loaded Leaflet
  const [leafletModule, setLeafletModule] = useState<LeafletType | null>(null);
  const [isLeafletLoaded, setIsLeafletLoaded] = useState(false);

  // Load Leaflet dynamically
  useEffect(() => {
    async function loadLeaflet() {
      try {
        const { default: L } = await import('leaflet');
        await import('leaflet-routing-machine');
        setLeafletModule(L);
        setIsLeafletLoaded(true);
      } catch (error) {
        console.error('Failed to load Leaflet:', error);
      }
    }

    loadLeaflet();
  }, []);

  // Default route style with dark mode awareness
  const defaultRouteStyle = {
    color: isDarkMode ? '#6366f1' : '#4f46e5',
    weight: 4,
    opacity: 0.8,
  };

  // Merge default styles with custom styles
  const finalRouteStyle = { ...defaultRouteStyle, ...routeStyle };

  // Calculate initial distance and time when locations change (as fallback)
  useEffect(() => {
    if (!leafletModule || locations.length <= 1) return;

    // Use this as fallback until we get the actual route data
    let distance = 0;
    for (let i = 1; i < locations.length; i++) {
      const prev = locations[i - 1];
      const curr = locations[i];
      const prevLatLng = new leafletModule.LatLng(
        prev.latitude,
        prev.longitude
      );
      const currLatLng = new leafletModule.LatLng(
        curr.latitude,
        curr.longitude
      );
      distance += prevLatLng.distanceTo(currLatLng);
    }

    if (!hasActualRoute) {
      setTotalDistance(distance);

      // Calculate estimated travel time based on mode and distance
      const distanceInKm = distance / 1000;
      const speed =
        typeof travelMode === 'number' ? travelMode : TRAVEL_SPEEDS[travelMode];
      const timeInHours = distanceInKm / speed;
      setTotalTime(timeInHours);
    }
  }, [locations, travelMode, hasActualRoute, leafletModule]);

  // Callback for when the actual route data is found
  const handleRouteFound = (distance: number, timeInMinutes: number) => {
    setTotalDistance(distance);
    setTotalTime(timeInMinutes / 60); // Convert minutes to hours
    setHasActualRoute(true);
  };

  const [icons, setIcons] = useState<{
    userLocationIcon: L.Icon;
    placeLocationIcon: L.Icon;
  } | null>(null);

  useEffect(() => {
    if (isLeafletLoaded) {
      createIcons().then((loaded) => setIcons(loaded));
    }
  }, [isLeafletLoaded]);

  // Show loading state while Leaflet or icons are loading
  if (!isLeafletLoaded || !leafletModule || !icons) {
    return (
      <div
        className={cn('flex items-center justify-center', className)}
        style={{ height, width }}
      >
        <div className="text-muted-foreground">Loading map...</div>
      </div>
    );
  }

  // Don't render if there are no locations
  if (!locations || locations.length === 0) {
    return null;
  }

  // Get center from the first location or middle of route
  const center =
    locations.length > 0
      ? [locations[0].latitude, locations[0].longitude]
      : [0, 0];

  const { userLocationIcon, placeLocationIcon } = icons;
  const L = leafletModule;

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border',
        isDarkMode ? 'border-muted/30' : 'border-muted/50',
        className
      )}
      style={{ height, width }}
    >
      <MapContainer
        center={center as [number, number]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className={cn({ 'dark-map': isDarkMode })}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={
            isDarkMode
              ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
              : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
        />

        {/* Display user location if provided */}
        {userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={userLocationIcon}
          >
            <Popup className={cn('rounded-lg', isDarkMode ? 'dark-popup' : '')}>
              <div
                className={cn(
                  'p-2 rounded-lg',
                  isDarkMode
                    ? 'bg-card/95 text-foreground'
                    : 'bg-white/95 text-gray-900'
                )}
              >
                <p>Your Location</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Render markers for each location point */}
        {locations.map((location, index) => {
          // Choose icon based on position in the route
          let icon;
          if (highlightEndpoints) {
            // First point is start, last point is end, others are waypoints
            if (index === 0) {
              icon = userLocationIcon; // Start point
            } else if (index === locations.length - 1) {
              icon = placeLocationIcon; // End point
            } else {
              // Middle waypoints
              icon = new L.DivIcon({
                className: 'custom-div-icon',
                html: `<div style="background-color: ${finalRouteStyle.color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
                iconSize: [12, 12],
                iconAnchor: [6, 6],
              });
            }
          } else {
            // All points use the same icon if not highlighting endpoints
            icon = placeLocationIcon;
          }

          return (
            <Marker
              key={`loc-${index}`}
              position={[location.latitude, location.longitude]}
              icon={icon}
            >
              <Popup
                className={cn('rounded-lg', isDarkMode ? 'dark-popup' : '')}
              >
                <div
                  className={cn(
                    'p-3 rounded-lg',
                    isDarkMode
                      ? 'bg-card/95 text-foreground'
                      : 'bg-white/95 text-gray-900'
                  )}
                >
                  <div className="font-medium mb-1">
                    {locationNames && locationNames[index]
                      ? locationNames[index]
                      : index === 0
                        ? 'Start Point'
                        : index === locations.length - 1
                          ? 'Destination'
                          : `Waypoint ${index}`}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {location.latitude.toFixed(5)},{' '}
                    {location.longitude.toFixed(5)}
                  </div>

                  {/* Show segment distance information - this will be an estimate */}
                  {showDistance && index > 0 && (
                    <div className="text-xs mt-2 pt-2 border-t border-muted/20">
                      <span className="text-muted-foreground">
                        Segment distance:{' '}
                      </span>
                      {formatDistance(
                        new L.LatLng(
                          locations[index - 1].latitude,
                          locations[index - 1].longitude
                        ).distanceTo(
                          new L.LatLng(location.latitude, location.longitude)
                        )
                      )}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Use routing machine for actual route visualization and measurements */}
        {locations.length >= 2 && (
          <RoutingMachineLayer
            locations={locations}
            routeStyle={finalRouteStyle}
            onRouteFound={handleRouteFound}
            L={L}
          />
        )}

        {/* Auto-fit the map to show all route points if enabled */}
        {autoFit && locations.length > 1 && (
          <FitBoundsToRoute locations={locations} L={L} />
        )}

        {/* Add route info control in the top right corner */}
        {(showDistance || showTravelTime) && locations.length >= 2 && (
          <RouteInfoControl
            distance={totalDistance}
            time={totalTime}
            hasActualRoute={hasActualRoute}
            L={L}
          />
        )}
      </MapContainer>
    </div>
  );
}
