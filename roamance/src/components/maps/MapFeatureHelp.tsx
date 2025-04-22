'use client';

import React from 'react';
import { FeatureHelpCard } from './FeatureHelpCard';

// Map features descriptions for contextual help
export const mapFeatures = {
  layers: 'Switch between map styles like Standard, Satellite, Terrain, and Transport',
  measure: 'Measure distances on the map by drawing lines',
  traffic: 'Show simulated traffic conditions in the area',
  share: 'Share this location with others or copy a link to it',
  waypoints: 'Add stops along your route when getting directions',
  theme: 'Toggle between light and dark mode for better visibility',
};

interface MapFeatureHelpProps {
  featureName: string | null;
  isDarkMode: boolean;
}

export function MapFeatureHelp({ featureName, isDarkMode }: MapFeatureHelpProps) {
  if (!featureName) {
    return null;
  }

  return (
    <FeatureHelpCard
      featureName={featureName}
      description={
        mapFeatures[featureName as keyof typeof mapFeatures]
      }
      isDarkMode={isDarkMode}
    />
  );
}
