'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { userService } from '@/service/user-service';
import {
  AccommodationType,
  ActivityType,
  BudgetLevel,
  ClimatePreference,
  CuisineType,
  TravelStyle,
  User,
  UserInfo,
  UserPreferences,
} from '@/types';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AccommodationSection } from './accommodation-section';
import { ActivitiesSection } from './activities-section';
import { BudgetSection } from './budget-section';
import { ClimateSection } from './climate-section';
import { CuisineSection } from './cuisine-section';
import { PreferenceHeader } from './preference-header';
import { SaveButton } from './save-button';
import { TravelStyleSection } from './travel-style-section';

interface ProfilePreferencesProps {
  user: User | null;
  userInfo: UserInfo | null;
  loading: boolean;
}

export function ProfilePreferences({ user, loading }: ProfilePreferencesProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(false);

  // Default preferences or loaded from user info
  const [preferences, setPreferences] = useState<UserPreferences>({
    travel_style: TravelStyle.BALANCED,
    accommodation_types: [
      AccommodationType.HOTELS,
      AccommodationType.APARTMENTS,
    ],
    activity_types: [
      ActivityType.SIGHTSEEING,
      ActivityType.NATURE_AND_OUTDOORS,
      ActivityType.FOOD_AND_DINING,
    ],
    cuisine_types: [CuisineType.LOCAL_CUISINE, CuisineType.INTERNATIONAL],
    climate_preference: ClimatePreference.WARM_AND_SUNNY,
    budget_level: BudgetLevel.MODERATE,
  });

  // Fetch user preferences when component mounts
  useEffect(() => {
    const fetchUserPreferences = async () => {
      if (!user) return;

      try {
        setIsLoadingPreferences(true);
        const userPreferences = await userService.getUserPreferences();

        // Map API preferences to our UI model
        setPreferences({
          travel_style: userPreferences.travel_style || TravelStyle.BALANCED,
          accommodation_types: Array.isArray(
            userPreferences.accommodation_types
          )
            ? userPreferences.accommodation_types
            : [AccommodationType.HOTELS, AccommodationType.APARTMENTS],
          activity_types: Array.isArray(userPreferences.activity_types)
            ? userPreferences.activity_types
            : [
                ActivityType.SIGHTSEEING,
                ActivityType.NATURE_AND_OUTDOORS,
                ActivityType.FOOD_AND_DINING,
              ],
          cuisine_types: Array.isArray(userPreferences.cuisine_types)
            ? userPreferences.cuisine_types
            : [CuisineType.LOCAL_CUISINE, CuisineType.INTERNATIONAL],
          climate_preference:
            userPreferences.climate_preference ||
            ClimatePreference.WARM_AND_SUNNY,
          budget_level: userPreferences.budget_level || BudgetLevel.MODERATE,
        });

        toast.success('Your preferences have been loaded');
      } catch (error) {
        console.error('Failed to fetch user preferences', error);
        toast.error('Failed to load your preferences');
      } finally {
        setIsLoadingPreferences(false);
      }
    };

    fetchUserPreferences();
  }, [user]);

  const handleSavePreferences = async () => {
    if (!user) return;

    try {
      setIsSaving(true);

      // Update user preferences using our service
      await userService.updateUserPreferences({
        travel_style: preferences.travel_style,
        accommodation_types: preferences.accommodation_types,
        activity_types: preferences.activity_types,
        cuisine_types: preferences.cuisine_types,
        climate_preference: preferences.climate_preference,
        budget_level: preferences.budget_level,
      });

      toast.success('Your travel preferences have been updated');
    } catch (error) {
      console.error('Failed to update preferences', error);
      toast.error('Failed to update your preferences');
    } finally {
      setIsSaving(false);
    }
  };

  // Animation variants for staggered children
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

  if (loading || isLoadingPreferences) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {[1, 2, 3].map((_, i) => (
          <motion.div
            key={i}
            variants={{
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
            }}
          >
            <Skeleton className="h-64 w-full rounded-xl" />
          </motion.div>
        ))}
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
      <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-radial from-sunset/5 to-transparent rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-40 left-10 w-72 h-72 bg-gradient-radial from-ocean/5 to-transparent rounded-full blur-3xl -z-10" />

      <PreferenceHeader />

      <TravelStyleSection
        selectedStyle={preferences.travel_style}
        onStyleChange={(style) =>
          setPreferences((prev) => ({ ...prev, travel_style: style }))
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AccommodationSection
          selectedTypes={preferences.accommodation_types}
          onTypesChange={(types) =>
            setPreferences((prev) => ({ ...prev, accommodation_types: types }))
          }
        />

        <ActivitiesSection
          selectedTypes={preferences.activity_types}
          onTypesChange={(types) =>
            setPreferences((prev) => ({ ...prev, activity_types: types }))
          }
        />

        <CuisineSection
          selectedTypes={preferences.cuisine_types}
          onTypesChange={(types) =>
            setPreferences((prev) => ({ ...prev, cuisine_types: types }))
          }
        />

        <ClimateSection
          selectedClimate={preferences.climate_preference}
          onClimateChange={(climate) =>
            setPreferences((prev) => ({ ...prev, climate_preference: climate }))
          }
        />
      </div>

      <BudgetSection
        budgetLevel={preferences.budget_level}
        onBudgetChange={(level) =>
          setPreferences((prev) => ({ ...prev, budget_level: level }))
        }
      />

      <SaveButton onClick={handleSavePreferences} isLoading={isSaving} />
    </motion.div>
  );
}
