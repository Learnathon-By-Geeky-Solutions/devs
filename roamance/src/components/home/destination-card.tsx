'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';

interface DestinationCardProps {
  title: string;
  location: string;
  image: string;
  rating: number;
  category: string;
}

export function DestinationCard({
  title,
  location,
  image,
  rating,
  category,
}: DestinationCardProps) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-xl"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />

      <div className="relative h-80 w-full p-5 flex flex-col justify-end z-20">
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
          {category}
        </div>

        <div className="absolute top-4 left-4 bg-primary/90 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
          <Star className="w-3 h-3 mr-1" />
          {rating.toFixed(1)}
        </div>

        <h3 className="text-white font-bold text-xl group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-white/80 text-sm flex items-center mt-2">
          <MapPin className="w-4 h-4 mr-1" />
          {location}
        </p>
      </div>
    </motion.div>
  );
}
