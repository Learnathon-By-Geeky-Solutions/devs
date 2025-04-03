'use client';

import * as React from 'react';
import {
  MapPin,
  Calendar,
  Compass,
  Plane,
  Users,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/constants/routes';
import { SectionHeading } from '@/components/common/section-heading';
import { FeatureItem } from '@/components/home/feature-item';
import { motion } from 'framer-motion';

export function FeatureShowcase() {
  const features = [
    {
      icon: MapPin,
      title: 'Explore Destinations',
      description:
        'Discover breathtaking locations around the world with detailed guides and insider tips.',
      colorClass: 'text-primary',
      bgColorClass: 'bg-primary/20',
    },
    {
      icon: Calendar,
      title: 'Plan Your Journey',
      description:
        'Create detailed travel itineraries with our AI-powered planning tools.',
      colorClass: 'text-sunset',
      bgColorClass: 'bg-sunset/20',
    },
    {
      icon: Compass,
      title: 'Find Adventures',
      description:
        'Discover unique experiences and activities tailored to your interests.',
      colorClass: 'text-forest',
      bgColorClass: 'bg-forest/20',
    },
    {
      icon: Plane,
      title: 'Track Flights',
      description:
        'Find the best deals on flights and keep track of your travel arrangements.',
      colorClass: 'text-sunset',
      bgColorClass: 'bg-sunset/20',
    },
    {
      icon: Users,
      title: 'Connect with Travelers',
      description:
        'Join a global community of like-minded adventurers and share experiences.',
      colorClass: 'text-forest',
      bgColorClass: 'bg-forest/20',
    },
    {
      icon: Sparkles,
      title: 'AI Recommendations',
      description:
        'Get personalized suggestions based on your preferences and past travels.',
      colorClass: 'text-ocean',
      bgColorClass: 'bg-ocean/20',
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Reimagine How You Travel"
          titleHighlight="Travel"
          subtitle="Roamance combines cutting-edge technology with a passion for exploration, making every journey more meaningful and memorable."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <FeatureItem
                key={index}
                icon={<IconComponent className={`h-6 w-6 ${feature.colorClass}`} />}
                title={feature.title}
                description={feature.description}
                colorClass={feature.colorClass}
                bgColorClass={feature.bgColorClass}
                index={index}
              />
            );
          })}
        </div>

        <div className="mt-16 bg-gradient-travel p-8 md:p-12 rounded-2xl dark:text-white">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-8 md:mb-0">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to start your adventure?
              </h3>
              <p className="dark:text-white/80 max-w-xl">
                Join thousands of travelers discovering the world with Roamance.
                Create an account today and begin your journey.
              </p>
            </div>
            <Link
              className="md:w-1/3 flex justify-center md:justify-end"
              href={routes.signUp.href}
            >
              <motion.button
                className="dark:bg-white bg-primary text-white dark:text-primary font-medium px-8 py-3 rounded-full transition-all cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up Now
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
