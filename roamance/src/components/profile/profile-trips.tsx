'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { User, UserInfo } from '@/types';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  CalendarRange,
  CheckCircle2,
  Clock,
  Compass,
  Flag,
  LucideIcon,
  MapPin,
  Plane,
  Plus,
  Route,
} from 'lucide-react';

interface ProfileTripsProps {
  user: User | null;
  userInfo: UserInfo | null;
  loading: boolean;
}

// Mock trip data
const upcomingTrips: Trip[] = [
  {
    id: '1',
    destination: 'Bali, Indonesia',
    image: '/images/bali.jpg',
    startDate: '2025-05-10',
    endDate: '2025-05-20',
    status: 'confirmed',
  },
  {
    id: '2',
    destination: 'Paris, France',
    image: '/images/paris.jpg',
    startDate: '2025-08-15',
    endDate: '2025-08-25',
    status: 'planning',
  },
];

const pastTrips: Trip[] = [
  {
    id: '3',
    destination: 'Tokyo, Japan',
    image: '/images/tokyo.jpg',
    startDate: '2024-11-05',
    endDate: '2024-11-15',
    status: 'completed',
  },
  {
    id: '4',
    destination: 'New York, USA',
    image: '/images/newyork.jpg',
    startDate: '2024-07-20',
    endDate: '2024-07-30',
    status: 'completed',
  },
  {
    id: '5',
    destination: 'Cairo, Egypt',
    image: '/images/cairo.jpg',
    startDate: '2023-12-10',
    endDate: '2023-12-20',
    status: 'completed',
  },
];

export function ProfileTrips({ loading }: ProfileTripsProps) {
  // Use trips from userInfo if available, otherwise fallback to mock data
  const userUpcomingTrips = upcomingTrips;
  const userPastTrips = pastTrips;

  // Format date to display in a more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate days until trip
  const daysUntil = (dateString: string) => {
    const today = new Date();
    const tripDate = new Date(dateString);
    const diffTime = tripDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calculate trip duration
  const tripDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge
            variant="outline"
            className="bg-forest/10 text-forest border-forest/30 px-2.5 py-0.5 rounded-full font-medium"
          >
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>Confirmed</span>
            </div>
          </Badge>
        );
      case 'planning':
        return (
          <Badge
            variant="outline"
            className="bg-ocean/10 text-ocean border-ocean/30 px-2.5 py-0.5 rounded-full font-medium"
          >
            <div className="flex items-center gap-1">
              <Route className="h-3 w-3" />
              <span>Planning</span>
            </div>
          </Badge>
        );
      case 'completed':
        return (
          <Badge
            variant="outline"
            className="bg-sunset/10 text-sunset border-sunset/30 px-2.5 py-0.5 rounded-full font-medium"
          >
            <div className="flex items-center gap-1">
              <Flag className="h-3 w-3" />
              <span>Completed</span>
            </div>
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
        className="space-y-8"
      >
        <motion.div variants={itemVariants}>
          <Skeleton className="h-12 w-full max-w-lg rounded-xl" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <motion.div key={i} variants={itemVariants}>
              <Skeleton className="h-60 w-full rounded-xl" />
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVariants}>
          <Skeleton className="h-40 w-full rounded-xl" />
        </motion.div>
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
      <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-radial from-ocean/5 to-transparent rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-40 left-10 w-72 h-72 bg-gradient-radial from-forest/5 to-transparent rounded-full blur-3xl -z-10" />

      <motion.div variants={itemVariants}>
        <Tabs defaultValue="upcoming" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <TabsList className="bg-muted/50 backdrop-blur-sm p-1 rounded-xl">
              <TabsTrigger
                value="upcoming"
                className="flex gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-ocean data-[state=active]:to-forest data-[state=active]:text-white rounded-lg"
              >
                <Plane className="h-4 w-4" />
                <span>Upcoming Trips</span>
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="flex gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-sunset data-[state=active]:to-sand data-[state=active]:text-white rounded-lg"
              >
                <Clock className="h-4 w-4" />
                <span>Past Travels</span>
              </TabsTrigger>
            </TabsList>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="outline"
                className="flex items-center gap-2 border-ocean/30 text-ocean hover:bg-ocean/10 hover:text-ocean-dark transition-all duration-300 shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Plan New Trip</span>
              </Button>
            </motion.div>
          </div>

          <TabsContent value="upcoming" className="pt-2 space-y-8">
            {userUpcomingTrips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userUpcomingTrips.map((trip, index) => (
                  <motion.div
                    key={trip.id}
                    variants={itemVariants}
                    custom={index}
                  >
                    <TripCard
                      trip={trip}
                      formatDate={formatDate}
                      daysUntil={daysUntil}
                      tripDuration={tripDuration}
                      getStatusBadge={getStatusBadge}
                      isUpcoming
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div variants={itemVariants}>
                <EmptyTripsState
                  title="No upcoming trips"
                  description="You don't have any upcoming trips planned yet. Start planning your next adventure!"
                />
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="past" className="pt-2 space-y-8">
            {userPastTrips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userPastTrips.map((trip, index) => (
                  <motion.div
                    key={trip.id}
                    variants={itemVariants}
                    custom={index}
                  >
                    <TripCard
                      trip={trip}
                      formatDate={formatDate}
                      tripDuration={tripDuration}
                      getStatusBadge={getStatusBadge}
                      isUpcoming={false}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div variants={itemVariants}>
                <EmptyTripsState
                  title="No travel history"
                  description="You haven't recorded any past trips yet. Once you complete a trip, it will appear here."
                />
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-muted/40 bg-gradient-to-b from-background to-background/95 backdrop-blur-sm shadow-md overflow-hidden pt-0">
          <CardHeader className="relative pt-4 pb-2">
            {/* Decorative accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-forest via-ocean to-sunset opacity-80" />

            <div className="pt-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-forest/10 text-forest">
                <CalendarRange className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Travel Stats</CardTitle>
                <CardDescription>
                  Your travel statistics and achievements
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatsCard
                icon={MapPin}
                label="Countries"
                value={userPastTrips.length}
                color="ocean"
              />
              <StatsCard
                icon={Plane}
                label="Total Trips"
                value={
                  userPastTrips.length +
                  userUpcomingTrips.filter((t) => t.status === 'confirmed')
                    .length
                }
                color="sunset"
              />
              <StatsCard
                icon={Calendar}
                label="Days Traveled"
                value={userPastTrips.reduce(
                  (acc, trip) =>
                    acc + tripDuration(trip.startDate, trip.endDate),
                  0
                )}
                color="forest"
              />
              <StatsCard
                icon={Flag}
                label="Bucket List"
                value={2}
                color="sand"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  color: 'ocean' | 'sunset' | 'forest' | 'sand';
}

function StatsCard({ icon: Icon, label, value, color }: StatsCardProps) {
  const getColorClass = (colorName: string, type: 'bg' | 'text' | 'border') => {
    const colorMap: Record<string, Record<string, string>> = {
      ocean: {
        bg: 'bg-ocean/10',
        text: 'text-ocean',
        border: 'border-ocean/30',
      },
      sunset: {
        bg: 'bg-sunset/10',
        text: 'text-sunset',
        border: 'border-sunset/30',
      },
      forest: {
        bg: 'bg-forest/10',
        text: 'text-forest',
        border: 'border-forest/30',
      },
      sand: { bg: 'bg-sand/10', text: 'text-sand', border: 'border-sand/30' },
    };

    return colorMap[colorName]?.[type] || '';
  };

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-xl p-4 text-center border',
        getColorClass(color, 'border'),
        getColorClass(color, 'bg'),
        'bg-gradient-to-b from-background/80 to-background/50 backdrop-blur-sm shadow-sm'
      )}
    >
      <div className="flex justify-center mb-2">
        <div
          className={cn(
            'p-2 rounded-full bg-white/20 shadow-sm',
            getColorClass(color, 'text')
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-muted-foreground text-sm font-medium">{label}</p>
      <p
        className={cn('text-3xl font-bold mt-1', getColorClass(color, 'text'))}
      >
        {value}
      </p>
    </motion.div>
  );
}

interface Trip {
  readonly id: string;
  readonly destination: string;
  readonly image: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly status: 'confirmed' | 'planning' | 'completed';
}

interface TripCardProps {
  readonly trip: Trip;
  readonly formatDate: (date: string) => string;
  readonly daysUntil?: (date: string) => number;
  readonly tripDuration: (start: string, end: string) => number;
  readonly getStatusBadge: (status: string) => React.ReactNode;
  readonly isUpcoming: boolean;
}

function TripCard({
  trip,
  formatDate,
  daysUntil,
  tripDuration,
  getStatusBadge,
  isUpcoming,
}: TripCardProps) {
  // Get gradient based on type
  const getGradient = () => {
    if (isUpcoming) {
      if (trip.status === 'confirmed')
        return 'from-forest/80 to-forest-dark/80';
      return 'from-ocean/80 to-ocean-dark/80';
    } else {
      return 'from-sunset/80 to-sand/80';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <Card className="overflow-hidden border-muted/40 bg-gradient-to-b from-background to-background/95 backdrop-blur-sm shadow-md transition-all duration-300 hover:shadow-xl py-0">
        <div className="relative h-44 w-full bg-muted">
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center bg-gradient-to-r',
              getGradient()
            )}
          >
            {/* Decorative pattern overlay */}
            <div className="absolute inset-0 bg-[url('/images/roamance-logo-no-text.png')] bg-repeat-space bg-contain opacity-10 mix-blend-overlay" />

            <div className="relative z-10 text-center px-4">
              <p className="text-white text-2xl font-bold drop-shadow-md">
                {trip.destination.split(',')[0]}
              </p>
              <p className="text-white text-sm opacity-90 mt-1 drop-shadow-md">
                {trip.destination.split(',')[1]?.trim()}
              </p>
            </div>
          </div>

          {/* Status badge */}
          <div className="absolute top-3 right-3 z-10">
            {getStatusBadge(trip.status)}
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">{trip.destination}</h3>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  'p-1.5 rounded-md',
                  isUpcoming
                    ? 'bg-ocean/10 text-ocean'
                    : 'bg-sunset/10 text-sunset'
                )}
              >
                <Calendar className="h-4 w-4" />
              </div>
              <span>
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  'p-1.5 rounded-md',
                  isUpcoming
                    ? 'bg-ocean/10 text-ocean'
                    : 'bg-sunset/10 text-sunset'
                )}
              >
                <Clock className="h-4 w-4" />
              </div>
              <span>
                Duration: {tripDuration(trip.startDate, trip.endDate)} days
              </span>
            </div>

            {isUpcoming && daysUntil && daysUntil(trip.startDate) > 0 && (
              <div className="mt-3 text-forest font-medium flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-forest/10">
                  <Compass className="h-4 w-4 text-forest" />
                </div>
                <span>{daysUntil(trip.startDate)} days until departure</span>
              </div>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-muted/30 flex justify-end">
            <motion.div
              whileHover={{ x: 3 }}
              whileTap={{ x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'flex items-center gap-2',
                  isUpcoming
                    ? 'hover:text-ocean hover:bg-ocean/5'
                    : 'hover:text-sunset hover:bg-sunset/5'
                )}
              >
                <span>View Details</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function EmptyTripsState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 border rounded-xl border-dashed border-muted/50 text-center px-4 bg-muted/5 backdrop-blur-sm"
    >
      <div className="w-16 h-16 rounded-full bg-ocean/10 flex items-center justify-center mb-4">
        <Plane className="h-8 w-8 text-ocean text-opacity-60" />
      </div>

      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-8">{description}</p>

      <motion.div
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.97 }}
      >
        <Button
          variant="default"
          className="flex items-center gap-2 bg-gradient-to-r from-ocean to-ocean-dark hover:opacity-90 transition-all duration-300 text-white shadow-md"
        >
          <Plus className="h-4 w-4" />
          Plan a Trip
        </Button>
      </motion.div>
    </motion.div>
  );
}
