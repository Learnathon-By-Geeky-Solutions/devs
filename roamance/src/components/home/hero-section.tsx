'use client';

import { Button } from '@/components/ui/button';
import { getInitialPlaces } from '@/service/tourism-service';
import { cn } from '@/lib/utils';
import { TouristPlace } from '@/types';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useRef, useState } from 'react';
import { GlobeMethods } from 'react-globe.gl';
import { GlobeContainer } from './globe/globe-container';
import { PlaceDetailsCard } from './globe/place-details-card';
import { useGlobeAnimation } from './globe/use-globe-animation';
import { PlaceSearchCommand } from './place-search-command';

export function HeroSection() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [places, setPlaces] = useState<TouristPlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<TouristPlace | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [detailsPosition, setDetailsPosition] = useState<'left' | 'right'>('right');
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

  const handlePlaceSelect = (place: TouristPlace) => {
    handlePlaceHover(place);

    // If the place doesn't exist in current places, add it
    if (!places.some(p => p.id === place.id)) {
      setPlaces(prevPlaces => [...prevPlaces, place]);
    }
  };

  return (
    <div className={cn(
      "relative min-h-screen overflow-hidden",
      isDarkMode ? "bg-[#010617]" : "bg-gradient-to-b from-sky-50 via-blue-50 to-white"
    )}>
      <div className="absolute inset-0 -z-10">
        {isDarkMode && (
          <div className="absolute inset-0">
            {Array.from({ length: 150 }).map((_, i) => (
              <div
                key={i}
                className={`absolute rounded-full bg-white ${
                  i % 3 === 0 ? 'w-px h-px' : i % 3 === 1 ? 'w-0.5 h-0.5' : 'w-1 h-1'
                } ${i % 5 === 0 ? 'animate-pulse' : ''}`}
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.7 + 0.3,
                }}
              />
            ))}
          </div>
        )}

        {!isDarkMode && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-[10%] left-[5%] w-[15%] h-[15%] rounded-full bg-white blur-3xl opacity-70"></div>
            <div className="absolute top-[20%] right-[15%] w-[20%] h-[10%] rounded-full bg-white blur-3xl opacity-80"></div>
            <div className="absolute bottom-[30%] left-[20%] w-[25%] h-[10%] rounded-full bg-white blur-3xl opacity-60"></div>
          </div>
        )}

        <div className={cn(
          "absolute bottom-0 left-0 right-0 h-1/4",
          isDarkMode
            ? "bg-gradient-to-t from-background to-transparent"
            : "bg-gradient-to-t from-white to-transparent"
        )} />

        <div className={cn(
          "absolute top-0 left-0 w-full h-full bg-gradient-radial",
          isDarkMode
            ? "from-primary/5 via-transparent to-transparent opacity-50"
            : "from-primary/10 via-transparent to-transparent opacity-30"
        )} />

        <div className={cn(
          "absolute top-0 right-0 w-1/2 h-full bg-gradient-radial",
          isDarkMode
            ? "from-forest/5 via-transparent to-transparent opacity-40"
            : "from-forest/10 via-transparent to-transparent opacity-30"
        )} />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 min-h-screen items-center gap-8">
          <div className="lg:col-span-2 pt-28 pb-12 lg:pt-32 lg:pb-20 flex flex-col justify-center gap-8 z-10">
            <motion.h1
              className={cn(
                "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight",
                isDarkMode ? "text-white" : "text-gray-900"
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Discover Your <br />
              <span className="text-primary">Next Adventure</span>
            </motion.h1>

            <motion.p
              className={cn(
                "max-w-md text-lg",
                isDarkMode ? "text-white/70" : "text-gray-600"
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Explore breathtaking destinations across the globe with Roamance, where every journey transforms into an unforgettable story.
            </motion.p>

            <motion.div
              className={cn(
                "w-full max-w-md rounded-xl p-3 shadow-lg border",
                isDarkMode
                  ? "bg-white/10 backdrop-blur-lg border-white/20"
                  : "bg-white/80 backdrop-blur-md border-gray-200"
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <PlaceSearchCommand onPlaceSelect={handlePlaceSelect} />
                </div>
                <Button
                  variant="default"
                  className="h-12 px-6 bg-primary hover:bg-primary/90 transition-colors"
                >
                  Explore
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className={cn(
                "hidden lg:flex items-center gap-3 mt-4",
                isDarkMode ? "text-white/70" : "text-gray-500"
              )}
            >
              <div className={cn(
                "w-8 h-[1px]",
                isDarkMode ? "bg-white/40" : "bg-gray-300"
              )}></div>
              <p className="text-sm font-light">Search for a destination or hover over the globe</p>
            </motion.div>
          </div>

          <motion.div
            className="lg:col-span-3 relative h-[600px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className={cn(
              "absolute -left-[10%] top-[25%] w-[200px] h-[200px] rounded-full filter blur-[80px]",
              isDarkMode ? "bg-primary/20" : "bg-primary/10"
            )}></div>
            <div className={cn(
              "absolute -right-[5%] bottom-[15%] w-[150px] h-[150px] rounded-full filter blur-[60px]",
              isDarkMode ? "bg-forest/20" : "bg-forest/10"
            )}></div>

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
          </motion.div>
        </div>
      </div>
    </div>
  );
}
