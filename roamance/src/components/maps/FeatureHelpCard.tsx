'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Layers, Ruler, TrafficCone, Share2, Navigation, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureHelpCardProps {
  featureName: string;
  description: string;
  isDarkMode: boolean;
}

export function FeatureHelpCard({
  featureName,
  description,
  isDarkMode,
}: FeatureHelpCardProps) {
  // Map feature icons with matching colors
  const featureConfig: Record<string, {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>,
    color: string,
    bgColor: string
  }> = {
    layers: {
      icon: Layers,
      color: 'text-blue-500',
      bgColor: isDarkMode ? 'bg-blue-500/15' : 'bg-blue-100'
    },
    measure: {
      icon: Ruler,
      color: 'text-emerald-500',
      bgColor: isDarkMode ? 'bg-emerald-500/15' : 'bg-emerald-100'
    },
    traffic: {
      icon: TrafficCone,
      color: 'text-amber-500',
      bgColor: isDarkMode ? 'bg-amber-500/15' : 'bg-amber-100'
    },
    share: {
      icon: Share2,
      color: 'text-purple-500',
      bgColor: isDarkMode ? 'bg-purple-500/15' : 'bg-purple-100'
    },
    waypoints: {
      icon: Navigation,
      color: 'text-rose-500',
      bgColor: isDarkMode ? 'bg-rose-500/15' : 'bg-rose-100'
    },
    theme: {
      icon: Moon,
      color: 'text-indigo-500',
      bgColor: isDarkMode ? 'bg-indigo-500/15' : 'bg-indigo-100'
    },
  };

  const config = featureConfig[featureName] || featureConfig.layers;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 5, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="absolute bottom-20 right-4 z-[1000]"
    >
      <Card
        className={cn(
          'p-0 backdrop-blur-md border shadow-lg overflow-hidden',
          isDarkMode
            ? 'bg-card/50 border-card-foreground/10'
            : 'bg-white/90 border-muted/30'
        )}
      >
        <div className="relative">
          {/* Decorative accent at top of card */}
          <div className={cn(
            "absolute top-0 left-0 right-0 h-1",
            config.color.replace('text-', 'bg-').replace('500', isDarkMode ? '500/40' : '400')
          )} />

          <div className="p-4 flex items-start gap-3">
            <div className={cn(
              'p-2 rounded-full',
              config.bgColor
            )}>
              <Icon className={cn("h-4 w-4", config.color)} />
            </div>

            <div className="space-y-1">
              <h4 className={cn(
                "text-sm font-medium capitalize flex items-center",
                config.color
              )}>
                {featureName}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
            </div>
          </div>

          {/* Optional: visual indicator that this is a tooltip */}
          <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2.5 h-2.5 bg-inherit border-r border-b border-inherit"></div>
        </div>
      </Card>
    </motion.div>
  );
}
