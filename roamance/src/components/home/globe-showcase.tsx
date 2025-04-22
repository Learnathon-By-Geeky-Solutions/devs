'use client';

import { SectionHeading } from '@/components/common/section-heading';
import { getInitialPlaces } from '@/api/places-api';
import { TouristPlace } from '@/types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { GlobeMethods } from 'react-globe.gl';

import { GlobeContainer } from './globe/globe-container';
import { PlaceDetailsCard } from './globe/place-details-card';
import { useGlobeAnimation } from './globe/use-globe-animation';

export function GlobeShowcase() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [places, setPlaces] = useState<TouristPlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<TouristPlace | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [detailsPosition, setDetailsPosition] = useState<'left' | 'right'>(
    'right'
  );
  const [isMouseOverGlobe, setIsMouseOverGlobe] = useState(false);

  const buildingsData = useMemo(
    () =>
      places.map((place) => ({
        ...place,
        altitude: 0.05,
        lat: place.lat,
        lng: place.lng,
        radius: 0.2,
        height: 0.3 + place.size * 0.2,
        color: place.color,
      })),
    [places]
  );

  useGlobeAnimation(globeRef, selectedPlace, isClient, isMouseOverGlobe);

  useEffect(() => {
    setIsClient(true);

    const fetchPlaces = async () => {
      try {
        const placesData = await getInitialPlaces();
        setPlaces(placesData);
      } catch (error) {
        console.error('Failed to fetch places:', error);
      }
    };

    const timer = setTimeout(() => {
      fetchPlaces();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handlePlaceHover = (place: TouristPlace | null) => {
    if (selectedPlace?.id === place?.id) return;

    setSelectedPlace(place);
    if (globeRef.current && place) {
      const pov = globeRef.current.pointOfView();
      const currentLng = pov ? pov.lng : 0;
      setDetailsPosition(place.lng > currentLng ? 'left' : 'right');

      globeRef.current.pointOfView(
        {
          lat: place.lat,
          lng: place.lng,
          altitude: 1.8,
        },
        1000
      );
    }
  };

  return (
    <section className="py-24 overflow-hidden relative bg-background/80">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-forest/5 blur-3xl"></div>
        <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] rounded-full bg-sunset/5 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          title="Explore the World"
          titleHighlight="World"
          subtitle="Discover breathtaking destinations around the globe with our interactive 3D map"
        />

        <div className="relative mt-12">
          <GlobeContainer
            isClient={isClient}
            buildingsData={buildingsData}
            globeRef={globeRef}
            onObjectHover={handlePlaceHover}
            setIsMouseOverGlobe={setIsMouseOverGlobe}
          />

          {selectedPlace && (
            <PlaceDetailsCard
              selectedPlace={selectedPlace}
              detailsPosition={detailsPosition}
            />
          )}
        </div>
      </div>
    </section>
  );
}
