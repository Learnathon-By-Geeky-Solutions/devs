'use client';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

import L from 'leaflet';
import 'leaflet-routing-machine';
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { MapControllerProps, RouteData } from '@/types/map';

// Helper function to check if coordinates have changed
const areCoordinatesEqual = (coord1: {lat: number, lng: number} | undefined, coord2: {lat: number, lng: number} | undefined) => {
  if (!coord1 || !coord2) return coord1 === coord2;
  return coord1.lat === coord2.lat && coord1.lng === coord2.lng;
};

// Helper to check if waypoints array has changed
const areWaypointsEqual = (wp1: {lat: number, lng: number}[] | undefined, wp2: {lat: number, lng: number}[] | undefined) => {
  if (!wp1 || !wp2) return wp1 === wp2;
  if (wp1.length !== wp2.length) return false;
  return wp1.every((wp, i) => areCoordinatesEqual(wp, wp2[i]));
};

export function MapController({
  center,
  destination,
  userLocation,
  directions,
  waypoints,
  onMapLoaded,
  onRouteCalculated,
}: MapControllerProps) {
  const map = useMap();
  const routingControlRef = useRef<L.Routing.Control | null>(null);
  const prevRouteParamsRef = useRef<{
    userLocation?: {lat: number, lng: number},
    destination?: {lat: number, lng: number},
    waypoints?: {lat: number, lng: number}[]
  }>({});

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `.leaflet-routing-container { z-index: 9999 !important; }`;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Initialize the map with an appropriate center point
  useEffect(() => {
    if (destination) {
      map.setView([destination.lat, destination.lng], 13);
    } else if (center.lat !== 0 && center.lng !== 0) {
      map.setView([center.lat, center.lng], 13);
    }

    if (onMapLoaded) {
      onMapLoaded();
    }
  }, [center, destination, map, onMapLoaded]);

  // Calculate route using Leaflet Routing Machine
  useEffect(() => {
    // Only calculate route if we have directions enabled, a destination, and a user location
    if (!directions || !destination || !userLocation) {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
      return;
    }

    // Check if any route parameters have changed
    const routeParamsChanged =
      !areCoordinatesEqual(prevRouteParamsRef.current.userLocation, userLocation) ||
      !areCoordinatesEqual(prevRouteParamsRef.current.destination, destination) ||
      !areWaypointsEqual(prevRouteParamsRef.current.waypoints, waypoints);

    // If nothing changed, don't recreate the routing control
    if (!routeParamsChanged && routingControlRef.current) {
      return;
    }

    // Save the current parameters for future comparison
    prevRouteParamsRef.current = {
      userLocation,
      destination,
      waypoints: waypoints ? [...waypoints] : undefined
    };

    // Remove existing routing control if it exists
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }

    const routeWaypoints: L.Routing.Waypoint[] = [];

    // Start with user location
    routeWaypoints.push(
      L.Routing.waypoint(
        L.latLng(userLocation.lat, userLocation.lng),
        'Starting Point'
      )
    );

    // Add intermediate waypoints if any
    if (waypoints && waypoints.length > 0) {
      waypoints.forEach((wp, index) => {
        routeWaypoints.push(
          L.Routing.waypoint(
            L.latLng(wp.lat, wp.lng),
            `Waypoint ${index + 1}`
          )
        );
      });
    }

    // End with destination
    routeWaypoints.push(
      L.Routing.waypoint(
        L.latLng(destination.lat, destination.lng),
        'Destination'
      )
    );

    // Create and add the routing control to the map
    const routingControl = L.Routing.control({
      waypoints: routeWaypoints,
      routeWhileDragging: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      lineOptions: {
        styles: [{ color: '#3b82f6', weight: 5 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0,
      },
      plan: L.Routing.plan(routeWaypoints, {
        createMarker: function () {
          return false;
        }, // Don't show the default markers
      }),
      formatter: new L.Routing.Formatter({
        language: 'en',
        units: 'metric',
        distanceTemplate: '{value} {unit}',
      }),
    });

    // Handle route found event
    routingControl.on('routesfound', function (e) {
      const routes = e.routes;
      if (routes && routes.length > 0) {
        const selectedRoute = routes[0];

        try {
          console.log('Route found:', selectedRoute);

          if (onRouteCalculated) {
            // Pass the raw route data without reconstructing
            onRouteCalculated(selectedRoute as unknown as RouteData);
          }
        } catch (error) {
          console.error('Error processing route data:', error);
          console.error(
            'Error details:',
            error instanceof Error ? error.message : String(error)
          );
        }
      }
    });

    // Add the routing control to the map
    routingControl.addTo(map);

    // Save the reference so we can remove it later
    routingControlRef.current = routingControl;
  }, [
    directions,
    userLocation,
    destination,
    map,
    waypoints,
    onRouteCalculated,
  ]);

  // Return null to make this a valid React component
  return null;
}
