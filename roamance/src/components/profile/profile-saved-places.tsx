'use client';

import { useState } from 'react';
import { User, UserInfo } from '@/types';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Bookmark,
  MapPin,
  Star,
  Search,
  Globe,
  Filter,
  X,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProfileSavedPlacesProps {
  user: User | null;
  userInfo: UserInfo | null;
  loading: boolean;
}

// Mock saved places data
const mockSavedPlaces = [
  {
    id: '1',
    name: 'Santorini, Greece',
    category: 'beach',
    rating: 4.9,
    saved: '2024-10-15',
    description:
      'Beautiful island with white buildings and blue domes overlooking the sea',
    tags: ['island', 'romantic', 'views'],
    image: '/santorini.jpg',
  },
  {
    id: '2',
    name: 'Mount Fuji, Japan',
    category: 'mountain',
    rating: 4.8,
    saved: '2024-11-05',
    description: "Japan's highest mountain and most iconic landmark",
    tags: ['hiking', 'nature', 'landmark'],
    image: '/fuji.jpg',
  },
  {
    id: '3',
    name: 'Grand Canyon, USA',
    category: 'nature',
    rating: 4.7,
    saved: '2024-09-22',
    description: 'One of the most spectacular natural wonders of the world',
    tags: ['hiking', 'views', 'nature'],
    image: '/grand-canyon.jpg',
  },
  {
    id: '4',
    name: 'Kyoto, Japan',
    category: 'city',
    rating: 4.6,
    saved: '2024-08-30',
    description:
      'Historic city known for its temples, gardens, and traditional architecture',
    tags: ['culture', 'history', 'food'],
    image: '/kyoto.jpg',
  },
  {
    id: '5',
    name: 'Amalfi Coast, Italy',
    category: 'beach',
    rating: 4.8,
    saved: '2024-07-15',
    description: 'Scenic coastline with colorful villages perched on cliffs',
    tags: ['scenic', 'food', 'romantic'],
    image: '/amalfi.jpg',
  },
  {
    id: '6',
    name: 'Serengeti National Park, Tanzania',
    category: 'nature',
    rating: 4.9,
    saved: '2024-06-18',
    description: 'Home to the annual migration of wildebeest and zebra',
    tags: ['safari', 'wildlife', 'nature'],
    image: '/serengeti.jpg',
  },
];

export function ProfileSavedPlaces({ loading }: ProfileSavedPlacesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Use saved places from userInfo if available, otherwise fallback to mock data
  const savedPlaces = mockSavedPlaces;

  const filters = [
    { id: 'all', label: 'All Places', icon: Globe },
    { id: 'beach', label: 'Beaches', icon: Umbrella },
    { id: 'mountain', label: 'Mountains', icon: Mountain },
    { id: 'city', label: 'Cities', icon: Building },
    { id: 'nature', label: 'Nature', icon: Leaf },
  ];

  // Filter places based on search term and category filter
  const filteredPlaces = savedPlaces.filter((place) => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesFilter =
      !activeFilter ||
      activeFilter === 'all' ||
      place.category === activeFilter;

    return matchesSearch && matchesFilter;
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
      },
    },
  };

  if (loading) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <motion.div variants={itemVariants}>
          <Skeleton className="h-12 w-full rounded-lg" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div key={i} variants={itemVariants}>
              <Skeleton className="h-64 w-full rounded-xl" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 relative"
    >
      {/* Decorative background elements */}
      <div className="absolute top-10 right-0 w-72 h-72 bg-gradient-radial from-sand/5 to-transparent rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-gradient-radial from-ocean/5 to-transparent rounded-full blur-3xl -z-10" />

      <motion.div variants={itemVariants}>
        <Card className="border-muted/40 bg-gradient-to-b from-background to-background/95 backdrop-blur-sm shadow-md overflow-hidden">
          <div className="relative px-6">
            {/* Decorative accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sand via-sunset to-forest opacity-80 -mt-6" />
            <div className="flex flex-col md:flex-row gap-4 items-stretch">
              <div className="relative flex-grow">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  <Search className="h-4 w-4 text-sand" />
                </div>
                <Input
                  placeholder="Search saved places..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 border-muted/50 focus:border-sand focus:ring-1 focus:ring-sand/30 bg-background/80 backdrop-blur-sm transition-colors"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-sand/10 hover:text-sand"
                    onClick={() => setSearchTerm('')}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear search</span>
                  </Button>
                )}
              </div>

              <div className="flex gap-2 overflow-x-auto overflow-y-visible pb-3 pt-1 px-1 scrollbar-hide flex-wrap md:justify-end">
                {filters.map((filter) => {
                  // Determine color based on filter id
                  const getColorClass = () => {
                    if (filter.id === 'beach')
                      return 'bg-sunset text-white font-medium';
                    if (filter.id === 'mountain')
                      return 'bg-forest text-white font-medium';
                    if (filter.id === 'nature')
                      return 'bg-forest-dark text-white font-medium';
                    if (filter.id === 'city')
                      return 'bg-ocean-dark text-white font-medium';
                    return 'bg-sand-dark text-white font-medium';
                  };

                  const getBorderColor = () => {
                    if (filter.id === 'beach')
                      return 'border-sunset hover:bg-sunset/20 text-sunset hover:text-sunset-dark font-medium';
                    if (filter.id === 'mountain')
                      return 'border-forest hover:bg-forest/20 text-forest hover:text-forest-dark font-medium';
                    if (filter.id === 'nature')
                      return 'border-forest-dark hover:bg-forest-dark/20 text-forest-dark hover:text-forest-dark font-medium';
                    if (filter.id === 'city')
                      return 'border-ocean-dark hover:bg-ocean-dark/20 text-ocean-dark hover:text-ocean-dark font-medium';
                    return 'border-sand-dark hover:bg-sand-dark/20 text-sand-dark hover:text-sand-dark font-medium';
                  };

                  return (
                    <motion.div
                      key={filter.id}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className="z-10"
                    >
                      <Button
                        variant={
                          activeFilter === filter.id ? 'default' : 'outline'
                        }
                        size="sm"
                        className={cn(
                          'rounded-full flex items-center gap-1.5 transition-all duration-300 shadow-sm',
                          activeFilter === filter.id
                            ? getColorClass()
                            : getBorderColor()
                        )}
                        onClick={() =>
                          setActiveFilter(
                            activeFilter === filter.id ? null : filter.id
                          )
                        }
                      >
                        <filter.icon className="h-3.5 w-3.5" />
                        <span>{filter.label}</span>
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-muted-foreground text-sm flex items-center gap-1.5">
                <Bookmark className="h-3.5 w-3.5 text-sand" />
                <span>Showing {filteredPlaces.length} saved places</span>
              </p>

              <Button
                variant="ghost"
                size="sm"
                className="text-sm flex gap-1.5 items-center text-muted-foreground hover:text-sand hover:bg-sand/5"
              >
                <Filter className="h-3.5 w-3.5" />
                <span>More filters</span>
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {filteredPlaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place, index) => (
            <motion.div key={place.id} variants={itemVariants} custom={index}>
              <SavedPlaceCard place={place} />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div variants={itemVariants}>
          <EmptyState
            searchTerm={searchTerm}
            activeFilter={activeFilter}
            onClear={() => {
              setSearchTerm('');
              setActiveFilter(null);
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}

interface SavedPlaceCardProps {
  place: {
    id: string;
    name: string;
    category: string;
    rating: number;
    saved: string;
    description: string;
    tags: string[];
    image: string;
  };
}

function SavedPlaceCard({ place }: SavedPlaceCardProps) {
  // Get gradient based on category
  const getGradient = () => {
    switch (place.category) {
      case 'beach':
        return 'from-sunset/80 to-sand/80';
      case 'mountain':
        return 'from-forest/80 to-forest-dark/80';
      case 'nature':
        return 'from-forest/80 to-forest-light/80';
      case 'city':
        return 'from-ocean/80 to-ocean-dark/80';
      default:
        return 'from-ocean/80 to-ocean-dark/80';
    }
  };

  // Get badge styles based on category
  const getBadgeStyle = () => {
    switch (place.category) {
      case 'beach':
        return 'bg-sunset text-white font-medium border border-sunset/20 shadow-sm';
      case 'mountain':
        return 'bg-forest text-white font-medium border border-forest/20 shadow-sm';
      case 'nature':
        return 'bg-forest-dark text-white font-medium border border-forest-dark/20 shadow-sm';
      case 'city':
        return 'bg-ocean-dark text-white font-medium border border-ocean-dark/20 shadow-sm';
      default:
        return 'bg-ocean-dark text-white font-medium border border-ocean-dark/20 shadow-sm';
    }
  };

  // Format saved date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <Card className="overflow-hidden group border-muted/40 bg-gradient-to-b from-background to-background/95 backdrop-blur-sm shadow-md transition-all duration-300 hover:shadow-xl py-0">
        {/* Place Image */}
        <div className="h-52 relative overflow-hidden">
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center bg-gradient-to-tr',
              getGradient()
            )}
          >
            {/* Decorative pattern overlay */}
            <div className="absolute inset-0 bg-[url('/images/roamance-logo-no-text.png')] bg-repeat-space bg-contain opacity-10 mix-blend-overlay" />

            <div className="relative z-10 text-center px-4">
              <p className="text-white text-xl font-bold drop-shadow-md">
                {place.name.split(',')[0]}
              </p>
              <p className="text-white text-sm drop-shadow-md">
                {place.name.split(',')[1]?.trim()}
              </p>
            </div>
          </div>

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <Badge
              className={cn(
                'capitalize rounded-full shadow-md px-2.5',
                getBadgeStyle()
              )}
            >
              {place.category}
            </Badge>
          </div>

          {/* Rating badge */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-white text-gray-800 flex items-center gap-1 font-medium rounded-full shadow-md">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              {place.rating}
            </Badge>
          </div>

          {/* Saved date badge */}
          <div className="absolute bottom-3 left-3">
            <Badge
              variant="outline"
              className="bg-black/50 text-white border-white/30 flex items-center gap-1.5 rounded-full backdrop-blur-sm shadow-sm"
            >
              <Calendar className="h-3 w-3" />
              <span className="text-xs font-medium">
                Saved {formatDate(place.saved)}
              </span>
            </Badge>
          </div>

          {/* Bookmark button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute bottom-3 right-3 h-9 w-9 rounded-full bg-white/15 backdrop-blur-md hover:bg-white/30 text-white border border-white/20 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <Bookmark className="h-4 w-4 fill-white" />
          </Button>
        </div>

        {/* Place Info */}
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold mb-1.5 group-hover:text-ocean transition-colors">
                {place.name}
              </h3>
              <div className="flex items-center text-muted-foreground text-sm gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                <span>{place.name.split(',')[1]?.trim()}</span>
              </div>
            </div>
          </div>

          <p className="text-muted-foreground text-sm mt-3 line-clamp-2 leading-relaxed">
            {place.description}
          </p>

          {/* Tags */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {place.tags.map((tag) => {
              // Assign colors based on tag content for visual variety
              const getTagStyle = () => {
                switch (tag) {
                  case 'island':
                  case 'beach':
                  case 'tropical':
                  case 'views':
                    return 'bg-sunset/20 text-sunset-dark hover:bg-sunset/30 border border-sunset/30';
                  case 'hiking':
                  case 'nature':
                  case 'wildlife':
                  case 'safari':
                    return 'bg-forest/20 text-forest-dark hover:bg-forest/30 border border-forest/30';
                  case 'romantic':
                  case 'scenic':
                  case 'sunset':
                  case 'luxury':
                    return 'bg-sand/20 text-sand-dark hover:bg-sand/30 border border-sand/30';
                  case 'culture':
                  case 'history':
                  case 'landmark':
                  case 'architecture':
                    return 'bg-ocean/20 text-ocean-dark hover:bg-ocean/30 border border-ocean/30';
                  case 'food':
                  case 'cuisine':
                  case 'culinary':
                  case 'dining':
                    return 'bg-sunset-light/30 text-sunset-dark hover:bg-sunset-light/40 border border-sunset-light/40';
                  default:
                    return 'bg-muted/50 text-foreground hover:bg-muted/60 border border-muted';
                }
              };

              return (
                <Badge
                  key={tag}
                  variant="secondary"
                  className={cn(
                    'cursor-pointer transition-colors duration-300 rounded-full text-xs px-2.5 font-medium',
                    getTagStyle()
                  )}
                >
                  {tag}
                </Badge>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="mt-4 pt-4 border-t border-muted/20 flex justify-between">
            <Button
              size="sm"
              variant="ghost"
              className="text-xs text-muted-foreground hover:text-ocean hover:bg-ocean/5 transition-colors duration-300"
            >
              View Details
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="text-xs text-muted-foreground hover:text-forest hover:bg-forest/5 transition-colors duration-300 flex items-center gap-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Explore</span>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function EmptyState({
  searchTerm,
  activeFilter,
  onClear,
}: {
  searchTerm: string;
  activeFilter: string | null;
  onClear: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 border rounded-xl border-dashed border-muted/50 text-center px-4 bg-muted/5 backdrop-blur-sm"
    >
      <div className="w-16 h-16 rounded-full bg-sand/10 flex items-center justify-center mb-4">
        <Bookmark className="h-8 w-8 text-sand text-opacity-60" />
      </div>

      <h3 className="text-xl font-medium mb-2">No saved places found</h3>
      <p className="text-muted-foreground max-w-sm mb-8">
        {searchTerm || activeFilter
          ? `No places match your current search "${searchTerm}" or the selected filter.`
          : `You haven't saved any places yet. Start exploring to add places to your collection!`}
      </p>

      {(searchTerm || activeFilter) && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={onClear}
            variant="outline"
            className="flex items-center gap-2 border-sand/30 text-sand hover:bg-sand/10 transition-all duration-300"
          >
            <X className="h-4 w-4" />
            Clear filters
          </Button>
        </motion.div>
      )}

      {!searchTerm && !activeFilter && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="default"
            className="flex items-center gap-2 bg-gradient-to-r from-ocean to-ocean-dark hover:opacity-90 transition-all duration-300 text-white shadow-md"
          >
            <Globe className="h-4 w-4" />
            Explore destinations
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

// Since these icons might not be imported at the top, defining them here
function Umbrella(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12a10.06 10.06 1 0 0-20 0Z" />
      <path d="M12 12v8a2 2 0 0 0 4 0" />
      <path d="M12 2v1" />
    </svg>
  );
}

function Mountain(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

function Building(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}

function Leaf(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}
