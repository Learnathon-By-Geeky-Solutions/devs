'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface StreetViewButtonProps {
  position: { lat: number; lng: number };
  isDarkMode: boolean;
}

export function StreetViewButton({
  position,
  isDarkMode,
}: StreetViewButtonProps) {
  const [streetViewOpen, setStreetViewOpen] = useState(false);
  const [viewerUrl, setViewerUrl] = useState('');

  useEffect(() => {
    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${position.lng - 0.002},${position.lat - 0.002},${position.lng + 0.002},${position.lat + 0.002}&layer=mapillary&marker=${position.lat},${position.lng}`;
    setViewerUrl(url);
  }, [position]);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant={isDarkMode ? 'outline' : 'secondary'}
            className={cn(
              'mt-2 w-full',
              isDarkMode ? 'bg-background/60 hover:bg-background/80' : ''
            )}
            onClick={() => setStreetViewOpen(true)}
          >
            Street View
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>See street-level imagery of this location</p>
        </TooltipContent>
      </Tooltip>

      <Dialog open={streetViewOpen} onOpenChange={setStreetViewOpen}>
        <DialogContent className="max-w-4xl w-full h-[80vh] z-[9999]">
          <DialogTitle className="sr-only">Street View</DialogTitle>
          <div className="w-full h-full flex flex-col">
            <iframe
              src={viewerUrl}
              className="w-full h-full border-none"
              title="Street View Map"
              allowFullScreen
              referrerPolicy="no-referrer"
            />
            <div className="py-2 text-xs text-center text-muted-foreground">
              Street-level imagery powered by OpenStreetMap & Mapillary
            </div>
            <div className="py-2 px-4 flex justify-between items-center border-t">
              <div className="text-sm">
                <span className="font-medium">Tip:</span> Click the blue lines
                or dots on the map to view street photos
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(
                    `https://www.openstreetmap.org/?mlat=${position.lat}&mlon=${position.lng}&layers=M`,
                    '_blank'
                  )
                }
              >
                Open in full viewer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
