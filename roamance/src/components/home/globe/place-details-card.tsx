import { cn } from '@/lib/utils';
import { getPlaceDetails } from '@/service/tourism-service';
import { TouristPlace } from '@/types';
import { motion } from 'framer-motion';
import { ExternalLink, Globe, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PlaceImagesCarousel } from './place-images-carousel';

interface PlaceDetailsCardProps {
  selectedPlace: TouristPlace;
  detailsPosition: 'left' | 'right';
}

export const PlaceDetailsCard = ({
  selectedPlace,
  detailsPosition,
}: PlaceDetailsCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [enrichedPlace, setEnrichedPlace] = useState<TouristPlace | null>(null);

  useEffect(() => {
    const fetchAdditionalDetails = async () => {
      setEnrichedPlace(null);

      if (selectedPlace.id.includes('api-')) {
        setIsLoading(true);
        try {
          const details = await getPlaceDetails(selectedPlace.id);
          if (details) {
            setEnrichedPlace(details);
          }
        } catch (error) {
          console.error('Error fetching place details:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAdditionalDetails();
  }, [selectedPlace.id, selectedPlace.name, selectedPlace.country]);

  const displayPlace = enrichedPlace || selectedPlace;
  const colorName = displayPlace.color.split('--')[1] || 'primary';

  const formatCoordinate = (coord: number): string => {
    const absCoord = Math.abs(coord);
    const degrees = Math.floor(absCoord);
    const minutes = Math.floor((absCoord - degrees) * 60);
    return `${degrees}°${minutes}'`;
  };

  const latitude = `${formatCoordinate(displayPlace.lat)}${displayPlace.lat >= 0 ? 'N' : 'S'}`;
  const longitude = `${formatCoordinate(displayPlace.lng)}${displayPlace.lng >= 0 ? 'E' : 'W'}`;

  const carouselImages = (() => {
    if (Array.isArray(displayPlace.images) && displayPlace.images.length > 0) {
      return displayPlace.images;
    } else if (displayPlace.image) {
      return [displayPlace.image];
    }
    return [];
  })();

  return (
    <motion.div
      className={cn(
        'absolute top-1/2 transform -translate-y-1/2 w-[300px] z-20',
        detailsPosition === 'left' ? 'left-8' : 'right-8'
      )}
      initial={{ opacity: 0, x: detailsPosition === 'left' ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: detailsPosition === 'left' ? -50 : 50 }}
      transition={{ duration: 0.3 }}
      key={`${selectedPlace.id}-${detailsPosition}`}
    >
      <div className="bg-background/80 backdrop-blur-md rounded-xl border shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="h-[150px] flex items-center justify-center bg-muted">
            <div className="animate-pulse">Loading images...</div>
          </div>
        ) : (
          carouselImages.length > 0 && (
            <PlaceImagesCarousel
              images={carouselImages}
              alt={displayPlace.name}
              height={150}
              isLoading={false}
            />
          )
        )}
        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className={cn('p-2 rounded-lg', `bg-${colorName}/20`)}>
              <MapPin className={cn('h-5 w-5', `text-${colorName}`)} />
            </div>
            <div>
              <h3 className="text-xl font-bold">{displayPlace.name}</h3>
              <p className="text-sm text-muted-foreground">
                {displayPlace.country}
              </p>
            </div>
          </div>

          <p className="mb-4">{displayPlace.description}</p>

          <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
            <Globe className="h-3 w-3" />
            <span>
              {latitude}, {longitude}
            </span>
          </div>

          <Link
            href={`/maps?lat=${displayPlace.lat}&lng=${displayPlace.lng}&name=${encodeURIComponent(displayPlace.name)}`}
            className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 transition-colors"
          >
            Explore {displayPlace.name} on map
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
