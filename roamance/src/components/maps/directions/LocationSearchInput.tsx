'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { MapPin, Search, X } from 'lucide-react';

interface LocationSearchInputProps {
  label: string;
  iconColor: string;
  iconBgColor: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  isSearching: boolean;
  isDarkMode: boolean;
  placeholder: string;
  currentLocationName?: string;
  ringColor?: string;
}

export function LocationSearchInput({
  label,
  iconColor,
  iconBgColor,
  icon,
  value,
  onChange,
  isSearching,
  isDarkMode,
  placeholder,
  currentLocationName,
  ringColor = 'ring-primary/50',
}: LocationSearchInputProps) {
  return (
    <div
      className={cn(
        'rounded-xl p-4 border transition-colors',
        isDarkMode
          ? 'bg-card/50 border-muted/20 hover:border-primary/30'
          : 'bg-card/80 border-muted/30 hover:border-primary/30'
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={cn("shadow-sm h-6 w-6 rounded-full flex items-center justify-center", iconBgColor)}>
          {icon}
        </div>
        <p className="text-sm font-medium">{label}</p>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            `text-xs h-9 bg-background/80 rounded-lg border-muted/30 focus-visible:${ringColor}`,
            isDarkMode
              ? 'placeholder:text-muted-foreground/70'
              : 'placeholder:text-muted-foreground/50'
          )}
        />
        {isSearching ? (
          <div className="w-5 h-5 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>
        ) : value ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full hover:bg-muted/20"
            onClick={() => onChange('')}
          >
            <X className="h-3 w-3" />
          </Button>
        ) : (
          <Search className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      {/* Show current location if no search is active */}
      {!value && currentLocationName && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground pl-2 mt-3">
          <MapPin className={cn("h-3 w-3", iconColor)} />
          <p>{currentLocationName}</p>
        </div>
      )}
    </div>
  );
}
