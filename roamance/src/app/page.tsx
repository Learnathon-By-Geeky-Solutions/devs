'use client';

import React from 'react';
import { Navbar } from '@/components/navigation';
import { HeroSection } from '@/components/home/hero-section';
import { FeatureShowcase } from '@/components/home/feature-showcase';
import { DestinationShowcase } from '@/components/home/destination-showcase';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <FeatureShowcase />
        <DestinationShowcase />
      </main>
      <Footer />
    </div>
  );
}
