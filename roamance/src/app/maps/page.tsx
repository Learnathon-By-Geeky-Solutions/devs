'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the MapPage component with SSR disabled
const MapPageClient = dynamic(() => import('./map-page-component').then(mod => ({ default: mod.MapPage })), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="text-lg font-medium">Loading map...</div>
    </div>
  ),
});

export default function MapsPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center">Loading...</div>}>
      <MapPageClient />
    </Suspense>
  );
}
