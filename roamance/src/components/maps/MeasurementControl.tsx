'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import { Ruler } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { FeatureGroup, useMap } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';

interface MeasurementControlProps {
  isDarkMode: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function MeasurementControl({
  isDarkMode,
  onMouseEnter,
  onMouseLeave,
}: MeasurementControlProps) {
  const [isMeasuring, setIsMeasuring] = useState(false);

  const handleMeasurementClick = () => {
    setIsMeasuring(!isMeasuring);
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isMeasuring ? 'default' : 'outline'}
            size="icon"
            onClick={handleMeasurementClick}
            className={cn(
              'h-10 w-10 rounded-full backdrop-blur-md shadow-lg',
              isMeasuring
                ? 'bg-primary text-primary-foreground'
                : isDarkMode
                  ? 'bg-card/90 border-primary/30 text-primary hover:bg-primary/20 hover:border-primary/50'
                  : 'bg-white/90 border-muted hover:bg-white'
            )}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <Ruler className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isMeasuring ? 'Stop measuring' : 'Measure distances'}</p>
        </TooltipContent>
      </Tooltip>

      {isMeasuring && <MeasurementTools />}
    </>
  );
}

export function MeasurementTools() {
  const map = useMap();
  const featureGroupRef = useRef<L.FeatureGroup | null>(null);

  useEffect(() => {
    if (map) {
      const DrawControl = L.Control.Draw;

      const drawControl = new DrawControl({
        draw: {
          polygon: false,
          marker: false,
          circle: false,
          rectangle: false,
          circlemarker: false,
          polyline: {
            shapeOptions: {
              color: '#3b82f6',
              weight: 3,
            },
            metric: true,
            feet: false,
          },
        },
        edit: {
          featureGroup: featureGroupRef.current as L.FeatureGroup,
          edit: false,
          remove: true,
        },
      });

      map.addControl(drawControl);

      return () => {
        map.removeControl(drawControl);
      };
    }
  }, [map]);

  return (
    <FeatureGroup
      ref={(el) => {
        featureGroupRef.current = el as L.FeatureGroup;
      }}
    >
      <EditControl
        position="topright"
        onCreated={(e) => {
          const layer = e.layer;
          if (
            layer instanceof L.Polyline &&
            !(layer instanceof L.Polygon) &&
            !(layer instanceof L.Rectangle)
          ) {
            const distanceInMeters = calculatePolylineDistance(layer);
            layer
              .bindPopup(`Distance: ${formatDistance(distanceInMeters)}`)
              .openPopup();
          }
        }}
        draw={{
          rectangle: false,
          circle: false,
          circlemarker: false,
          marker: false,
          polygon: false,
          polyline: true,
        }}
      />
    </FeatureGroup>
  );
}

// Helper function to calculate polyline distance
export function calculatePolylineDistance(polyline: L.Polyline): number {
  const latlngs = polyline.getLatLngs() as L.LatLng[];
  let totalDistance = 0;

  for (let i = 1; i < latlngs.length; i++) {
    totalDistance += latlngs[i - 1].distanceTo(latlngs[i]);
  }

  return totalDistance;
}

// Helper function to format distance
export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)} km`;
  } else {
    return `${Math.round(meters)} m`;
  }
}
