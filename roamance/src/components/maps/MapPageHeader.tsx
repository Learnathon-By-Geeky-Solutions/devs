'use client';

import { BackButton } from '@/components/maps';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronRight, Globe, MapPin, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

interface MapPageHeaderProps {
  isDarkMode: boolean;
  userLocation: { lat: number; lng: number } | null;
  directions: boolean;
  showDirectionsPanel: boolean;
  handleCenterOnUser: () => void;
  toggleDirectionsPanel: () => void;
}

export function MapPageHeader({
  isDarkMode,
  userLocation,
  directions,
  showDirectionsPanel,
  handleCenterOnUser,
  toggleDirectionsPanel,
}: MapPageHeaderProps) {
  return (
    <div
      className={cn(
        'w-full py-4 px-5 flex items-center justify-between relative z-10',
        isDarkMode
          ? 'bg-background/60 backdrop-blur-xl border-b border-muted/20'
          : 'bg-white/70 backdrop-blur-xl border-b border-muted/20'
      )}
    >
      <div className="flex items-center gap-3">
        <BackButton />
        <div className="flex flex-col">
          <h1 className="font-semibold text-lg md:text-xl flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary hidden sm:inline-block" />
            <span>{directions ? 'Directions' : 'Interactive Map'}</span>
          </h1>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Explore destinations and find your way around the world
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {userLocation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              size="sm"
              variant="outline"
              className={cn(
                'flex items-center gap-1.5 h-9 px-3 rounded-full shadow-lg',
                isDarkMode
                  ? 'bg-card/90 border-primary/40 text-primary hover:bg-primary/30 hover:border-primary/60'
                  : 'bg-white/90 border-primary/40 text-primary/90 hover:bg-primary/10 hover:text-primary'
              )}
              onClick={handleCenterOnUser}
            >
              <MapPin className={cn("h-3.5 w-3.5", isDarkMode ? "text-primary" : "")} />
              <span className="font-medium">Your Location</span>
            </Button>
          </motion.div>
        )}

        {directions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Button
              size="sm"
              variant={showDirectionsPanel ? "secondary" : "default"}
              className={cn(
                'flex items-center gap-1.5 h-9 px-3 rounded-full shadow-sm',
                showDirectionsPanel
                  ? isDarkMode
                    ? 'bg-muted/80 text-foreground'
                    : 'bg-muted/50 text-foreground'
                  : 'bg-primary text-primary-foreground'
              )}
              onClick={toggleDirectionsPanel}
            >
              <Navigation className="h-3.5 w-3.5" />
              <span className="font-medium">{showDirectionsPanel ? 'Hide' : 'Show'} Directions</span>
              <ChevronRight
                className={cn(
                  'h-3 w-3 transition-transform',
                  showDirectionsPanel ? 'rotate-90' : ''
                )}
              />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
