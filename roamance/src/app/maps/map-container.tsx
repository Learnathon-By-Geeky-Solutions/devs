'use client';

import { FeatureHelpCard } from '@/components/maps/FeatureHelpCard';
import { LocationInfoCard } from '@/components/maps/LocationInfoCard';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Globe, HelpCircle, Info, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Import RouteData type
import { Button } from '@/components/ui/button';
import { RouteData } from '@/types';

// Dynamically import the LeafletMap component to avoid SSR issues
const LeafletMap = dynamic(() => import('@/components/maps/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 to-blue-50/30 dark:from-background dark:to-background/95" />

      <motion.div
        className="flex flex-col items-center gap-3 z-10 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <motion.div
            className="h-20 w-20 rounded-full bg-blue-100/50 dark:bg-blue-900/20 flex items-center justify-center"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            }}
          >
            <Globe className="h-10 w-10 text-primary/80" strokeWidth={1.5} />
          </motion.div>

          <motion.div
            className="absolute -inset-1.5 rounded-full border border-primary/30 dark:border-primary/20"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
              delay: 0.2
            }}
          />
        </div>

        <div className="text-center space-y-1.5 max-w-[220px]">
          <h3 className="font-medium text-lg text-foreground/90">Loading Map</h3>
          <p className="text-sm text-muted-foreground">Preparing your interactive map experience</p>
        </div>
      </motion.div>
    </div>
  ),
});

interface MapContainerProps {
  center: { lat: number; lng: number };
  destination: { lat: number; lng: number } | null;
  locationName: string;
  userLocation: { lat: number; lng: number } | null;
  searchQuery: string;
  directions: boolean;
  isDarkMode: boolean;
  centerOnUser?: boolean;
  onRouteCalculated?: (routeData: RouteData) => void;
  isCustomStartPoint?: boolean;
  onSearchResultSelect?: (lat: number, lng: number, name: string) => void;
}

export function MapContainer({
  center,
  destination,
  locationName,
  userLocation,
  searchQuery,
  directions,
  isDarkMode,
  centerOnUser,
  onRouteCalculated,
  isCustomStartPoint = false,
  onSearchResultSelect,
}: MapContainerProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [infoCardVisible, setInfoCardVisible] = useState(true);
  const [mapFeatureHelp, setMapFeatureHelp] = useState<string | null>(null);

  // Set up tooltips for map features
  const mapFeatures = {
    layers:
      'Switch between map styles like Standard, Satellite, Terrain, and Transport',
    measure: 'Measure distances on the map by drawing lines',
    traffic: 'Show simulated traffic conditions in the area',
    share: 'Share this location with others or copy a link to it',
    waypoints: 'Add stops along your route when getting directions',
    theme: 'Toggle between light and dark mode for better visibility',
  };

  // Listen for map control hover events
  useEffect(() => {
    const handleMapControlHover = (e: Event) => {
      setMapFeatureHelp((e as CustomEvent).detail.feature);
    };

    const handleMapControlLeave = () => {
      // Add a small timeout before hiding to make the UI feel smoother
      setTimeout(() => setMapFeatureHelp(null), 100);
    };

    window.addEventListener('mapControlHover', handleMapControlHover);
    window.addEventListener('mapControlLeave', handleMapControlLeave);

    return () => {
      window.removeEventListener('mapControlHover', handleMapControlHover);
      window.removeEventListener('mapControlLeave', handleMapControlLeave);
    };
  }, []);

  return (
    <div className="h-full w-full relative">
      {/* Glass effect overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={cn(
          "absolute left-0 top-0 w-1/4 h-1/4 rounded-full opacity-20 blur-3xl",
          isDarkMode ? "bg-primary/5" : "bg-primary/10"
        )} style={{ transform: 'translate(-30%, -30%)' }} />

        <div className={cn(
          "absolute right-0 bottom-0 w-1/3 h-1/3 rounded-full opacity-20 blur-3xl",
          isDarkMode ? "bg-blue-500/5" : "bg-blue-500/10"
        )} style={{ transform: 'translate(20%, 20%)' }} />
      </div>

      {/* Location info card */}
      <AnimatePresence>
        {infoCardVisible && mapLoaded && destination && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <LocationInfoCard
              visible={true}
              locationName={locationName}
              center={destination}
              isDarkMode={isDarkMode}
            />
            <Button
              onClick={() => setInfoCardVisible(false)}
              className={cn(
                'absolute top-3 right-3 h-7 w-7 rounded-full p-0',
                isDarkMode
                  ? 'bg-background/40 border-background/20 hover:bg-background/60'
                  : 'bg-background/70 border-muted hover:bg-background/90'
              )}
              variant="outline"
              size="icon"
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Close location info</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feature help card */}
      <AnimatePresence>
        {mapFeatureHelp && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
          >
            <FeatureHelpCard
              featureName={mapFeatureHelp}
              description={mapFeatures[mapFeatureHelp as keyof typeof mapFeatures]}
              isDarkMode={isDarkMode}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map help tooltip */}
      <TooltipProvider>
        <motion.div
          className="absolute bottom-4 right-4 z-[1000]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.3 }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  'p-2.5 rounded-full cursor-pointer transition-all duration-200 hover:scale-105',
                  isDarkMode
                    ? 'bg-background/70 backdrop-blur-md border border-primary/30 text-primary shadow-md shadow-primary/5'
                    : 'bg-white/90 backdrop-blur-md border border-primary/20 text-primary/80 shadow-lg shadow-primary/5'
                )}
              >
                <HelpCircle className="h-5 w-5" />
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="max-w-xs z-[2000] backdrop-blur-sm border border-primary/20 shadow-lg p-0 overflow-hidden"
              sideOffset={5}
            >
              <div className={cn(
                "space-y-3",
                isDarkMode
                  ? "bg-card/95 text-card-foreground"
                  : "bg-white/95"
              )}>
                <div className={cn(
                  "px-4 py-3 border-b",
                  isDarkMode ? "border-primary/20" : "border-muted/50"
                )}>
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    <span>Map Features Guide</span>
                  </h4>
                </div>
                <ul className="px-4 pb-3 space-y-2.5 text-xs">
                  {Object.entries(mapFeatures).map(([key, description]) => (
                    <li key={key} className="flex items-start gap-2">
                      <span className={cn(
                        "font-medium capitalize flex-shrink-0 px-1.5 py-0.5 rounded text-xs",
                        isDarkMode
                          ? "bg-primary/20 text-primary"
                          : "bg-primary/20 text-primary"
                      )}>
                        {key}
                      </span>
                      <span className={cn(
                        isDarkMode
                          ? "text-muted-foreground"
                          : "text-foreground/80"
                      )}>
                        {description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </motion.div>
      </TooltipProvider>

      <LeafletMap
        center={center}
        destination={destination}
        locationName={locationName}
        userLocation={userLocation}
        searchQuery={searchQuery}
        directions={directions}
        onMapLoaded={() => setMapLoaded(true)}
        isDarkMode={isDarkMode}
        centerOnUser={centerOnUser}
        onRouteCalculated={onRouteCalculated}
        isCustomStartPoint={isCustomStartPoint}
        onSearchResultSelect={onSearchResultSelect}
      />
    </div>
  );
}
