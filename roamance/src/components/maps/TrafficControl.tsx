'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { TrafficCone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Circle, Popup, useMap } from 'react-leaflet';

interface TrafficControlProps {
  isDarkMode: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

interface TrafficPoint {
  position: [number, number];
  radius: number;
  intensity: number;
}

export function TrafficControl({
  isDarkMode,
  onMouseEnter,
  onMouseLeave,
}: TrafficControlProps) {
  const [showTraffic, setShowTraffic] = useState(false);

  const toggleTraffic = () => {
    setShowTraffic(!showTraffic);
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={showTraffic ? 'default' : 'outline'}
            size="icon"
            onClick={toggleTraffic}
            className={cn(
              'h-10 w-10 rounded-full backdrop-blur-md shadow-lg',
              showTraffic
                ? 'bg-primary text-primary-foreground'
                : isDarkMode
                  ? 'bg-card/90 border-primary/30 text-primary hover:bg-primary/20 hover:border-primary/50'
                  : 'bg-white/90 border-muted hover:bg-white'
            )}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <TrafficCone className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{showTraffic ? 'Hide traffic' : 'Show traffic'}</p>
        </TooltipContent>
      </Tooltip>

      {showTraffic && <TrafficLayer isDarkMode={isDarkMode} />}
    </>
  );
}

export function TrafficLayer({ isDarkMode }: { isDarkMode: boolean }) {
  const map = useMap();
  const [trafficData, setTrafficData] = useState<TrafficPoint[]>([]);

  useEffect(() => {
    // Simulate traffic data
    // In a real app, this would be fetched from a traffic API
    const bounds = map.getBounds();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    // Generate random traffic points
    const trafficPoints = [];
    for (let i = 0; i < 10; i++) {
      const lat = sw.lat + Math.random() * (ne.lat - sw.lat);
      const lng = sw.lng + Math.random() * (ne.lng - sw.lng);
      const intensity = Math.random(); // 0 to 1 (light to heavy)

      trafficPoints.push({
        position: [lat, lng] as [number, number],
        radius: 200 + Math.random() * 500,
        intensity,
      });
    }

    setTrafficData(trafficPoints);

    // Re-generate traffic when map moves
    const handleMapMove = () => {
      const newBounds = map.getBounds();
      const newNE = newBounds.getNorthEast();
      const newSW = newBounds.getSouthWest();

      const newTrafficPoints = [];
      for (let i = 0; i < 10; i++) {
        const lat = newSW.lat + Math.random() * (newNE.lat - newSW.lat);
        const lng = newSW.lng + Math.random() * (newNE.lng - newSW.lng);
        const intensity = Math.random();

        newTrafficPoints.push({
          position: [lat, lng] as [number, number],
          radius: 200 + Math.random() * 500,
          intensity,
        });
      }

      setTrafficData(newTrafficPoints);
    };

    map.on('moveend', handleMapMove);

    return () => {
      map.off('moveend', handleMapMove);
    };
  }, [map]);

  return (
    <>
      {trafficData.map((point, index) => (
        <Circle
          key={index}
          center={[point.position[0], point.position[1]]}
          radius={point.radius}
          pathOptions={{
            color: getTrafficColor(point.intensity),
            fillOpacity: 0.4,
            weight: 2,
          }}
        >
          <Popup>
            <div className={cn(isDarkMode ? 'text-white' : 'text-black')}>
              <h4 className="font-medium">Traffic {index + 1}</h4>
              <p className="text-sm">
                {getTrafficDescription(point.intensity)}
              </p>
            </div>
          </Popup>
        </Circle>
      ))}
    </>
  );
}

function getTrafficColor(intensity: number): string {
  if (intensity < 0.3) return '#4ade80'; // Light traffic - green
  if (intensity < 0.7) return '#facc15'; // Medium traffic - yellow
  return '#ef4444'; // Heavy traffic - red
}

function getTrafficDescription(intensity: number): string {
  if (intensity < 0.3) return 'Light traffic';
  if (intensity < 0.7) return 'Moderate traffic';
  return 'Heavy traffic';
}
