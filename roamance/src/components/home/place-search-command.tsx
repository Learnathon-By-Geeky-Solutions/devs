'use client';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { searchPlaces } from '@/service/tourism-service';
import { TouristPlace } from '@/types';
import {
  ChevronsUpDown,
  Globe,
  Loader2,
  MapPin,
  Search,
  X,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';

interface PlaceSearchCommandProps {
  readonly onPlaceSelect: (place: TouristPlace) => void;
  readonly className?: string;
}

export function PlaceSearchCommand({
  onPlaceSelect,
  className,
}: PlaceSearchCommandProps) {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  const [open, setOpen] = React.useState(false);
  const [mainValue, setMainValue] = React.useState('');
  const [refinedValue, setRefinedValue] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const [places, setPlaces] = React.useState<TouristPlace[]>([]);
  const [searchMode, setSearchMode] = React.useState<'location' | 'region'>(
    'location'
  );

  const searchTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const refinedInputRef = React.useRef<HTMLInputElement>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const [triggerWidth, setTriggerWidth] = React.useState<number>(0);

  React.useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [open, className]);

  React.useEffect(() => {
    if (open && mainValue && !refinedValue) {
      setRefinedValue(mainValue);
    }
  }, [open, mainValue, refinedValue]);

  React.useEffect(() => {
    if (refinedValue.length < 2) {
      setPlaces([]);
      return;
    }

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    setIsSearching(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const results = await searchPlaces(refinedValue);
        setPlaces(results);
      } catch (error) {
        console.error('Error searching places:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [refinedValue]);

  const handleSelectPlace = (placeId: string) => {
    const selectedPlace = places.find((place) => place.id === placeId);
    if (selectedPlace) {
      onPlaceSelect(selectedPlace);
      setMainValue(selectedPlace.name);
      setOpen(false);
      setRefinedValue('');
    }
  };

  const handleClearMain = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMainValue('');
  };

  const handleClearRefined = () => {
    setRefinedValue('');
    if (refinedInputRef.current) {
      refinedInputRef.current.focus();
    }
  };

  const toggleSearchMode = () => {
    setSearchMode(searchMode === 'location' ? 'region' : 'location');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div ref={triggerRef} className={cn('w-full relative', className)}>
          <Search
            className={cn(
              'absolute left-3 top-3.5 h-5 w-5 z-10 transition-all duration-200',
              isDarkMode ? 'text-white/60' : 'text-gray-400',
              mainValue && (isDarkMode ? 'text-primary/80' : 'text-primary/70')
            )}
          />
          <Button
            variant="outline"
            aria-expanded={open}
            className={cn(
              'w-full h-12 pl-10 pr-10 justify-start text-left font-normal',
              'shadow-sm transition-all duration-200',
              'rounded-xl border-2',
              mainValue ? '' : 'text-muted-foreground',
              isDarkMode
                ? 'bg-gradient-to-r from-slate-900/80 to-slate-800/80 text-white border-indigo-500/30 hover:border-indigo-500/50 hover:bg-slate-800/90'
                : 'bg-gradient-to-r from-white/80 to-white/95 text-gray-900 border-indigo-100 hover:border-indigo-200 hover:bg-white/100',
              open &&
                (isDarkMode
                  ? 'ring-2 ring-indigo-500/20 border-indigo-500/40'
                  : 'ring-2 ring-indigo-200/50 border-indigo-300/60')
            )}
            onClick={() => setOpen(true)}
          >
            {mainValue || 'Where would you like to go?'}
          </Button>
          {mainValue && (
            <button
              onClick={handleClearMain}
              className={cn(
                'absolute right-10 top-3.5 z-10 pr-1.5',
                'cursor-pointer',
                isDarkMode ? 'text-white/60' : 'text-gray-400',
                'hover:text-primary transition-colors duration-200'
              )}
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <ChevronsUpDown
            className={cn(
              'absolute right-3 top-4 h-4 w-4 transition-opacity duration-200',
              isDarkMode ? 'text-white/40' : 'text-gray-400/70',
              open && 'opacity-70'
            )}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          'p-0 z-50 rounded-xl',
          'shadow-lg shadow-black/5 border-2 transition-all duration-200',
          isDarkMode
            ? 'bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-md border-indigo-500/30'
            : 'bg-gradient-to-b from-white/95 to-gray-50/98 backdrop-blur-md border-indigo-100'
        )}
        align="start"
        side="bottom"
        sideOffset={0}
        style={{ width: triggerWidth ? `${triggerWidth}px` : 'auto' }}
      >
        <Command shouldFilter={false}>
          <div className="flex items-center gap-2 p-3 border-b border-border">
            <div className="relative flex-1">
              <Search
                className={cn(
                  'absolute left-3 top-2.5 h-4 w-4 transition-colors duration-200',
                  isDarkMode ? 'text-white/50' : 'text-gray-400',
                  refinedValue && 'text-primary'
                )}
              />
              <CommandInput
                ref={refinedInputRef}
                placeholder={
                  searchMode === 'location'
                    ? 'Search specific destinations...'
                    : 'Search regions or countries...'
                }
                value={refinedValue}
                onValueChange={setRefinedValue}
                className={cn(
                  'h-10 pl-9 pr-9 rounded-lg font-normal',
                  'border-2 transition-all duration-200 shadow-sm',
                  isDarkMode
                    ? 'bg-slate-800/80 text-white border-indigo-500/30 focus:border-indigo-500/50'
                    : 'bg-white text-gray-900 border-indigo-100 focus:border-indigo-300/60',
                  'focus-visible:ring-primary/20 focus-visible:ring-2'
                )}
              />
              {refinedValue && (
                <button
                  onClick={handleClearRefined}
                  className={cn(
                    'absolute right-3 top-3 pr-1.5',
                    'cursor-pointer',
                    isDarkMode ? 'text-white/50' : 'text-gray-400',
                    'hover:text-primary transition-colors duration-200'
                  )}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              onClick={toggleSearchMode}
              className={cn(
                'h-10 w-10 flex items-center justify-center rounded-lg transition-all duration-200',
                'border-2',
                isDarkMode
                  ? 'hover:bg-white/10 text-white/70 hover:text-white border-indigo-500/30 hover:border-indigo-500/50'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900 border-indigo-100 hover:border-indigo-200'
              )}
              title={
                searchMode === 'location'
                  ? 'Search by region'
                  : 'Search by location'
              }
            >
              {searchMode === 'location' ? (
                <Globe className="h-5 w-5" />
              ) : (
                <MapPin className="h-5 w-5" />
              )}
            </button>
          </div>

          <CommandList className="max-h-[350px] overflow-auto">
            {isSearching && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}

            {!isSearching && refinedValue.length > 1 && places.length === 0 && (
              <CommandEmpty className="py-6 text-center">
                No destinations found
                <p className="text-xs text-muted-foreground mt-2">
                  Try searching for a different{' '}
                  {searchMode === 'location' ? 'place' : 'region'} or toggle
                  search mode
                </p>
              </CommandEmpty>
            )}

            {!isSearching && places.length > 0 && (
              <CommandGroup
                heading={searchMode === 'location' ? 'Destinations' : 'Regions'}
                className="py-2"
              >
                {places.map((place) => (
                  <CommandItem
                    key={place.id}
                    value={place.id}
                    onSelect={handleSelectPlace}
                    className={cn(
                      'p-3 cursor-pointer rounded-md m-1',
                      isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-md bg-cover bg-center flex-shrink-0 border"
                        style={{
                          backgroundImage: `url(${place.image})`,
                          borderColor: place.color,
                        }}
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium">{place.name}</span>
                          <div
                            className={cn(
                              'w-1.5 h-1.5 rounded-full',
                              isDarkMode ? 'bg-white/50' : 'bg-gray-300'
                            )}
                          ></div>
                          <span className="text-sm text-muted-foreground">
                            {place.country}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {place.description ||
                            `Popular destination in ${place.country}`}
                        </span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {!isSearching && refinedValue.length < 2 && (
              <div className="flex flex-col items-center justify-center py-8 px-4">
                <Globe
                  className={cn(
                    'h-10 w-10 mb-4',
                    'opacity-70 transition-opacity duration-300',
                    isDarkMode ? 'text-indigo-400/50' : 'text-indigo-400/40'
                  )}
                />
                <p className="text-center text-sm mb-6 max-w-[280px]">
                  <span
                    className={cn(
                      'font-medium',
                      isDarkMode ? 'text-white/80' : 'text-gray-700'
                    )}
                  >
                    Discover the world
                  </span>
                  <span className="text-muted-foreground block mt-1">
                    Start typing to find amazing destinations around the globe
                  </span>
                </p>

                <div className="text-sm font-medium mb-2 self-start pl-1">
                  Popular destinations
                </div>

                <div className={cn('grid grid-cols-2 gap-2.5 w-full')}>
                  {[
                    { country: 'France', emoji: '🇫🇷' },
                    { country: 'Japan', emoji: '🇯🇵' },
                    { country: 'US', emoji: '🇺🇸' },
                    { country: 'Egypt', emoji: '🇪🇬' },
                  ].map((item) => (
                    <button
                      key={item.country}
                      type="button"
                      className={cn(
                        'flex items-center gap-2 py-3 px-3.5 rounded-lg text-sm',
                        'border-2 transition-all duration-200',
                        'bg-opacity-50 backdrop-blur-sm',
                        isDarkMode
                          ? 'hover:bg-indigo-950/40 text-white/90 border-indigo-500/20 hover:border-indigo-500/30 bg-indigo-950/20'
                          : 'hover:bg-indigo-50/80 text-gray-700 border-indigo-100 hover:border-indigo-200 bg-indigo-50/50'
                      )}
                      onClick={() => setRefinedValue(item.country)}
                    >
                      <div
                        className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
                          isDarkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'
                        )}
                      >
                        <span className="text-xs">{item.emoji}</span>
                      </div>
                      <span>{item.country}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
