'use client';

import { SectionHeading } from '@/components/common/section-heading';
import { CategoryButton } from '@/components/home/category-button';
import { DestinationCard } from '@/components/home/destination-card';
import { categories, destinations } from '@/data/destinations';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import * as React from 'react';

export function DestinationShowcase() {
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
