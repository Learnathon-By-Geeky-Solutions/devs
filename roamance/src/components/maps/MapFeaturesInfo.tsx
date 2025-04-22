'use client';

import { useMediaQuery } from '@/hooks';
import { cn } from '@/lib/utils';
import { Layers, Navigation, Ruler, Share, TrafficCone } from 'lucide-react';

interface MapFeaturesInfoProps {
  isDarkMode: boolean;
}

export function MapFeaturesInfo({ isDarkMode }: MapFeaturesInfoProps) {
  // Only show on mobile devices
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (!isMobile) return null;

  const features = [
    { name: 'Map Layers', icon: Layers, description: 'Different map styles' },
    { name: 'Measure', icon: Ruler, description: 'Calculate distances' },
    {
      name: 'Traffic',
      icon: TrafficCone,
      description: 'View traffic conditions',
    },
    { name: 'Share', icon: Share, description: 'Share location' },
    { name: 'Routes', icon: Navigation, description: 'Get directions' },
  ];

  return (
    <div
      className={cn(
        'w-full py-2 px-4 border-t flex items-center justify-between overflow-x-auto scrollbar-hide',
        isDarkMode
          ? 'bg-background/90 backdrop-blur-md border-muted/20'
          : 'bg-white/90 backdrop-blur-md border-muted/30'
      )}
    >
      {features.map((feature) => (
        <div
          key={feature.name}
          className="flex flex-col items-center px-2 min-w-[72px]"
        >
          <div
            className={cn(
              'p-1.5 rounded-full',
              isDarkMode ? 'bg-primary/20' : 'bg-primary/10'
            )}
          >
            <feature.icon
              className={cn(
                'h-3 w-3',
                isDarkMode ? 'text-primary' : 'text-primary'
              )}
            />
          </div>
          <span className="text-[10px] font-medium mt-1">{feature.name}</span>
          <span
            className={cn(
              'text-[8px]',
              isDarkMode
                ? 'text-muted-foreground/80'
                : 'text-muted-foreground/70'
            )}
          >
            {feature.description}
          </span>
        </div>
      ))}
    </div>
  );
}
