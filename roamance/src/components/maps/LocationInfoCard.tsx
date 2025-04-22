'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Compass, Info, MapPin, Navigation, Share2, X } from 'lucide-react';
import { useState } from 'react';

interface LocationInfoCardProps {
  visible?: boolean; // Now optional
  locationName: string;
  center: { lat: number; lng: number };
  isDarkMode: boolean;
}

export function LocationInfoCard({
  locationName,
  center,
  isDarkMode,
}: LocationInfoCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [copied, setCopied] = useState(false);

  // Don't return null, only hide if center is invalid
  if (center.lat === 0 && center.lng === 0) {
    return null;
  }

  const handleGetDirections = () => {
    const event = new CustomEvent('getDirections');
    window.dispatchEvent(event);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${locationName} on Roamance`,
          text: `Check out ${locationName} on Roamance Maps!`,
          url: `${window.location.origin}/maps?lat=${center.lat}&lng=${center.lng}&name=${encodeURIComponent(locationName)}`,
        })
        .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(
        `${window.location.origin}/maps?lat=${center.lat}&lng=${center.lng}&name=${encodeURIComponent(locationName)}`
      );

      // Show copy confirmation
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Format coordinates to be more readable
  const formatCoord = (coord: number): string => {
    const absCoord = Math.abs(coord);
    const degrees = Math.floor(absCoord);
    const minutes = Math.floor((absCoord - degrees) * 60);
    return `${degrees}°${minutes}'`;
  };

  const latitude = `${formatCoord(center.lat)}${center.lat >= 0 ? 'N' : 'S'}`;
  const longitude = `${formatCoord(center.lng)}${center.lng >= 0 ? 'E' : 'W'}`;

  return (
    <motion.div
      className="absolute top-4 left-4 z-[1000] max-w-xs"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.4,
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
    >
      <Card
        className={cn(
          'backdrop-blur-md border shadow-lg p-0 overflow-hidden',
          isDarkMode
            ? 'bg-card/60 border-card-foreground/15 shadow-black/20'
            : 'bg-white/90 border-muted/20 shadow-black/10'
        )}
      >
        <div className="relative">
          {/* Decorative accent at top of card */}
          <div
            className={cn(
              'absolute top-0 left-0 right-0 h-1.5',
              isDarkMode ? 'bg-primary/50' : 'bg-primary/40'
            )}
          />

          {/* Card header with location information */}
          <div className="pt-4 px-4 pb-3 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'p-2 rounded-full',
                  isDarkMode ? 'bg-primary/20' : 'bg-primary/10'
                )}
              >
                <MapPin className="h-5 w-5 text-primary" />
              </div>

              <div className='flex flex-col gap-2'>
                <h3 className="text-base font-semibold leading-tight mb-1.5">
                  {locationName}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs font-normal',
                      isDarkMode
                        ? 'bg-primary/10 hover:bg-primary/20 text-primary border-primary/20'
                        : 'bg-primary/5 hover:bg-primary/10 text-primary/90 border-primary/20'
                    )}
                  >
                    {showInfo ? 'Destination' : latitude + ', ' + longitude}
                  </Badge>

                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs font-normal cursor-pointer transition-all',
                      isDarkMode
                        ? 'bg-muted/30 text-muted-foreground border-muted/50 hover:bg-muted/40'
                        : 'bg-muted/30 text-muted-foreground border-muted/50 hover:bg-muted/40'
                    )}
                    onClick={() => setShowInfo(!showInfo)}
                  >
                    {showInfo ? (
                      <>
                        {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
                      </>
                    ) : (
                      'Destination'
                    )}
                  </Badge>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-7 w-7 p-0 rounded-full transition-colors',
                expanded
                  ? isDarkMode
                    ? 'bg-muted/60 hover:bg-muted/80'
                    : 'bg-muted/40 hover:bg-muted/60'
                  : ''
              )}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <X className="h-4 w-4" />
              ) : (
                <Navigation className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Expanded section with actions */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: expanded ? 'auto' : 0,
              opacity: expanded ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className={cn(
              'px-4 overflow-hidden border-t',
              isDarkMode ? 'border-muted/20' : 'border-muted/30'
            )}
          >
            <div className="py-4 space-y-4">
              <div className="flex items-center gap-2">
                <Button
                  className={cn(
                    'flex-1 h-9 rounded-full gap-2',
                    isDarkMode ? 'bg-primary/80 hover:bg-primary/70' : ''
                  )}
                  onClick={handleGetDirections}
                >
                  <Compass className="h-4 w-4" />
                  <span>Directions</span>
                </Button>

                <Button
                  variant="outline"
                  className={cn(
                    'h-9 w-9 p-0 rounded-full relative',
                    isDarkMode
                      ? 'border-primary/20 hover:bg-primary/10'
                      : 'border-primary/10 hover:bg-primary/5'
                  )}
                  onClick={handleShare}
                >
                  {copied ? (
                    <motion.span
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center rounded-full bg-green-500/90"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </motion.span>
                  ) : (
                    <Share2 className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div
                className={cn(
                  'text-xs px-3 py-2 rounded-md',
                  isDarkMode
                    ? 'bg-muted/30 text-muted-foreground'
                    : 'bg-muted/20 text-muted-foreground'
                )}
              >
                <div className="flex items-start gap-2">
                  <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <p>
                    Tap on the map to view more details and discover nearby
                    points of interest.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
