'use client';

import { QuickLinkCard } from '@/components/home/quick-link-card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Calendar, Compass, Globe, MapPin, Search } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with parallax effect */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70 dark:opacity-50"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
      </div>

      {/* Hero content */}
      <div className="container relative pt-32 pb-20 h-screen flex flex-col justify-center items-center text-center gap-8 px-4 mx-auto max-w-7xl">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Where Every Journey <br />
          <span className="text-primary">Becomes a Story</span>
        </motion.h1>

        <motion.p
          className="max-w-2xl text-lg text-foreground/70 dark:text-foreground/80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Discover breathtaking destinations, connect with fellow travelers, and
          create unforgettable memories with Roamance - your ultimate travel
          companion.
        </motion.p>

        {/* Search box */}
        <motion.div
          className="w-full max-w-4xl bg-background/80 backdrop-blur-md rounded-xl p-4 shadow-lg border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Where would you like to go?"
                className="w-full bg-background h-12 pl-10 pr-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                className="h-12 flex gap-2 items-center"
              >
                <Calendar className="h-4 w-4" />
                <span>Choose Dates</span>
              </Button>
              <Button
                variant="default"
                className="h-12 px-6 bg-gradient-to-r from-primary/90 to-primary"
              >
                Explore Now
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick link cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mt-4 mb-8 lg:mb-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <QuickLinkCard
            icon={<MapPin className="h-5 w-5 text-primary" />}
            title="Top Destinations"
            description="Explore popular places"
            hoverColor="bg-primary/10"
            borderColor="primary"
            bgColor="bg-primary/20"
          />

          <QuickLinkCard
            icon={<Calendar className="h-5 w-5 text-sunset" />}
            title="Travel Plans"
            description="Create your itinerary"
            hoverColor="bg-sunset/10"
            borderColor="sunset"
            bgColor="bg-sunset/20"
          />

          <QuickLinkCard
            icon={<Compass className="h-5 w-5 text-forest" />}
            title="Adventures"
            description="Thrilling experiences"
            hoverColor="bg-forest/10"
            borderColor="forest"
            bgColor="bg-forest/20"
          />

          <QuickLinkCard
            icon={<Globe className="h-5 w-5 text-indigo-500" />}
            title="Community"
            description="Connect with travelers"
            hoverColor="bg-indigo-500/10"
            borderColor="indigo-500"
            bgColor="bg-indigo-500/20"
          />
        </motion.div>
      </div>
    </div>
  );
}
