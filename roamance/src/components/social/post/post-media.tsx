'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { MediaIndicator } from '../ui/shared-components';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export interface PostMediaProps {
  imagePaths: string[];
  videoPaths: string[];
  onMediaClick?: (index: number) => void;
}

export const PostMedia = ({
  imagePaths,
  videoPaths,
  onMediaClick
}: PostMediaProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalMedia = imagePaths.length + videoPaths.length;

  // Reset current index when media changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [imagePaths, videoPaths]);

  const handleNext = () => {
    if (currentIndex < totalMedia - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(totalMedia - 1);
    }
  };

  if (totalMedia === 0) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/80 group md:w-2/5 flex-shrink-0">
      <div
        className="aspect-[16/10] md:aspect-square h-full cursor-pointer"
        onClick={() => onMediaClick?.(currentIndex)}
      >
        <AnimatePresence mode="wait">
          {currentIndex < imagePaths.length ? (
            <motion.div
              key={`image-${currentIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative h-full w-full"
            >
              <Image
                src={imagePaths[currentIndex]}
                alt={`Post image ${currentIndex + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                className="transition-all duration-700 group-hover:scale-[1.03]"
              />
              {/* Glassmorphism overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60"></div>
            </motion.div>
          ) : (
            <motion.div
              key={`video-${currentIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              <video
                src={videoPaths[currentIndex - imagePaths.length]}
                className="w-full h-full object-cover"
                controls
                preload="metadata"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation arrows with improved design */}
      {totalMedia > 1 && (
        <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <NavigationButton onClick={handlePrev} direction="prev" />
          <NavigationButton onClick={handleNext} direction="next" />
        </div>
      )}

      {/* Media indicators (dots) with glass effect */}
      {totalMedia > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/40 backdrop-blur-xl rounded-full px-3 py-2 transition-opacity duration-300 shadow-md">
          {Array.from({ length: totalMedia }).map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.3 }}
              onClick={() => setCurrentIndex(index)}
              className={`rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? 'w-2.5 h-2.5 bg-white shadow-glow'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to media ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Media type indicators with glass effect */}
      <div className="absolute top-4 right-4 flex space-x-2">
        {imagePaths.length > 0 && (
          <MediaIndicator type="image" count={imagePaths.length} />
        )}
        {videoPaths.length > 0 && (
          <MediaIndicator type="video" count={videoPaths.length} />
        )}
      </div>
    </div>
  );
};

interface NavigationButtonProps {
  onClick: () => void;
  direction: 'prev' | 'next';
}

const NavigationButton = ({ onClick, direction }: NavigationButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="h-10 w-10 rounded-full bg-black/30 backdrop-blur-xl flex items-center justify-center text-white border border-white/20 shadow-lg transform transition-all"
  >
    {direction === 'prev' ? (
      <ArrowLeft size={18} strokeWidth={2.5} />
    ) : (
      <ArrowRight size={18} strokeWidth={2.5} />
    )}
  </motion.button>
);
