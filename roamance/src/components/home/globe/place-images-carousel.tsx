'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { ImageOff } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface PlaceImagesCarouselProps {
  images: string[];
  alt: string;
  height?: number;
  isLoading?: boolean;
}

interface CarouselApi {
  on(event: string, callback: () => void): void;
  off(event: string, callback: () => void): void;
  selectedScrollSnap(): number;
  scrollTo(index: number): void;
}

export const PlaceImagesCarousel = ({
  images,
  alt,
  height = 150,
  isLoading = false,
}: PlaceImagesCarouselProps) => {
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Check if we have any images to display
  const hasImages = images && images.length > 0;

  // Track current slide
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  if (!hasImages) {
    // Display a placeholder when no images are available
    return (
      <div
        className="relative w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
        style={{ height: `${height}px` }}
      >
        <div className="text-gray-400 dark:text-gray-500 flex flex-col items-center">
          <ImageOff className="w-8 h-8 mb-2" />
          <span className="text-sm">No images available</span>
        </div>
      </div>
    );
  }

  return (
    <Carousel
      setApi={setApi}
      className="w-full"
      style={{ height: `${height}px` }}
      opts={{
        loop: true,
      }}
    >
      <CarouselContent className="h-full">
        {images.map((image, index) => (
          <CarouselItem key={`image-${index}`} className="h-full">
            <div className="relative w-full h-full">
              <Image
                src={image}
                alt={`${alt} - image ${index + 1}`}
                className="object-cover rounded-t-xl w-full"
                style={{ height: `${height}px` }}
                sizes="full"
                height={0}
                width={0}
                priority={index === 0}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      )}

      {/* Only show navigation controls if there are multiple images */}
      {images.length > 1 && (
        <>
          {/* Indicator dots */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 md:gap-1.5 z-10">
            {images.map((_, index) => (
              <button
                key={`indicator-${index}`}
                className={cn(
                  'w-1.5 h-1.5 rounded-full transition-colors',
                  index === currentIndex ? 'bg-white' : 'bg-white/40'
                )}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </Carousel>
  );
};
