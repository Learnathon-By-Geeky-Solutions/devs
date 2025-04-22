'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Share } from 'lucide-react';

interface ShareMapButtonProps {
  position: { lat: number; lng: number };
  locationName: string;
  isDarkMode: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function ShareMapButton({
  position,
  locationName,
  isDarkMode,
  onMouseEnter,
  onMouseLeave,
}: ShareMapButtonProps) {
  const shareMap = async () => {
    const shareUrl = `${window.location.origin}/maps?lat=${position.lat}&lng=${position.lng}&name=${encodeURIComponent(locationName)}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out ${locationName} on Roamance`,
          text: `I found this amazing place: ${locationName}`,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert('Map link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
      });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={shareMap}
          className={cn(
            'h-10 w-10 rounded-full backdrop-blur-md shadow-lg',
            isDarkMode
              ? 'bg-card/90 border-primary/40 text-primary hover:bg-primary/30 hover:border-primary/60'
              : 'bg-white/90 border-primary/40 text-primary/90 hover:bg-primary/10 hover:text-primary'
          )}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <Share className={cn("h-5 w-5", isDarkMode ? "text-primary" : "")} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Share this location</p>
      </TooltipContent>
    </Tooltip>
  );
}
