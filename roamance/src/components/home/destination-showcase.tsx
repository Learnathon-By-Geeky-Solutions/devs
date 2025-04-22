'use client';

import * as React from 'react';
import { DestinationCard } from '@/components/home/destination-card';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/common/section-heading';
import { CategoryButton } from '@/components/home/category-button';
import { motion } from 'framer-motion';

export function DestinationShowcase() {
  const destinations = [
    {
      title: 'Santorini',
      location: 'Greece',
      image:
        'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80',
      rating: 4.8,
      category: 'Islands',
    },
    {
      title: 'Kyoto',
      location: 'Japan',
      image:
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      rating: 4.7,
      category: 'Cultural',
    },
    {
      title: 'Machu Picchu',
      location: 'Peru',
      image:
        'https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      rating: 4.9,
      category: 'Historical',
    },
    {
      title: 'Serengeti',
      location: 'Tanzania',
      image:
        'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1168&q=80',
      rating: 4.8,
      category: 'Wildlife',
    },
    {
      title: 'Bali',
      location: 'Indonesia',
      image:
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1038&q=80',
      rating: 4.6,
      category: 'Beaches',
    },
    {
      title: 'Banff',
      location: 'Canada',
      image:
        'https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
      rating: 4.7,
      category: 'Mountains',
    },
  ];

  const categories = [
    'All',
    'Islands',
    'Cultural',
    'Historical',
    'Wildlife',
    'Beaches',
    'Mountains',
  ];
  const [activeCategory, setActiveCategory] = React.useState('All');

  const filteredDestinations =
    activeCategory === 'All'
      ? destinations
      : destinations.filter((dest) => dest.category === activeCategory);

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Popular Destinations"
          titleHighlight="Destinations"
          subtitle="Explore some of the most breathtaking places around the world"
        />

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category, index) => (
            <CategoryButton
              key={category}
              category={category}
              activeCategory={activeCategory}
              onClick={setActiveCategory}
              index={index}
            />
          ))}
        </div>

        {/* Destinations grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((destination, index) => (
            <motion.div
              key={destination.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <DestinationCard {...destination} />
            </motion.div>
          ))}
        </div>

        {/* View all button */}
        <div className="flex justify-center mt-12">
          <motion.button
            className="bg-background border border-input hover:bg-accent hover:text-accent-foreground px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-colors"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Destinations
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
