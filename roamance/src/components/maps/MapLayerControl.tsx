'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Layers } from 'lucide-react';

// Different map tile layers
export const mapLayers = {
  standard: {
    light: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    name: 'Standard',
    description: 'Default map view showing roads and basic features',
  },
  satellite: {
    light:
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    dark: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    name: 'Satellite',
    description: 'Satellite imagery of the area',
  },
  terrain: {
    light:
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    name: 'Terrain',
    description: 'Map showing topography and elevation features',
  },
  transport: {
    light: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
    dark: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
    name: 'Transport',
    description: 'Map showing roads, transit routes and cycling paths',
  },
};

export const mapLayerAttribution = {
  standard:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  satellite: '&copy; <a href="https://www.arcgis.com/">Esri</a>',
  terrain:
    '&copy; <a href="https://carto.com">CARTO</a>, <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  transport:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://github.com/cyclosm/cyclosm-cartocss-style">CyclOSM</a>',
};

interface MapLayerControlProps {
  currentLayer: keyof typeof mapLayers;
  setCurrentLayer: (layer: keyof typeof mapLayers) => void;
  isDarkMode: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function MapLayerControl({
  currentLayer,
  setCurrentLayer,
  isDarkMode,
  onMouseEnter,
  onMouseLeave,
}: MapLayerControlProps) {
  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  'h-10 w-10 rounded-full backdrop-blur-md shadow-lg',
                  isDarkMode
                    ? 'bg-card/90 border-primary/40 text-primary hover:bg-primary/30 hover:border-primary/60'
                    : 'bg-white/90 border-primary/40 text-primary/90 hover:bg-primary/10 hover:text-primary'
                )}
              >
                <Layers className={cn("h-5 w-5", isDarkMode ? "text-primary" : "")} />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Change map style</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="w-56" align="end">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Map Type</h4>
            <RadioGroup
              value={currentLayer}
              onValueChange={(value) =>
                setCurrentLayer(value as keyof typeof mapLayers)
              }
            >
              {Object.entries(mapLayers).map(([key, layer]) => (
                <div key={key} className="flex items-center space-x-2">
                  <RadioGroupItem value={key} id={`layer-${key}`} />
                  <div>
                    <Label htmlFor={`layer-${key}`}>{layer.name}</Label>
                    <p className="text-xs text-muted-foreground">
                      {layer.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
