'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { ProfileHeader } from './profile-header';
import { ProfileInfo } from './profile-info';
import { ProfilePreferences } from './preferences';
import { ProfileSavedPlaces } from './profile-saved-places';
import { ProfileTabs } from './profile-tabs';
import { ProfileTrips } from './profile-trips';
import { User, UserInfo } from '@/types';
import { userService } from '@/service/user-service';

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState('info');
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { user, userInfo } = await userService.getFullUserProfile();
      setUser(user);
      setUserInfo(userInfo);
    } catch (error) {
      console.error('Failed to fetch user profile', error);
      toast.error('Failed to load profile information');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <ProfileInfo
            user={user}
            userInfo={userInfo}
            loading={loading}
            onProfileUpdate={fetchUserProfile}
          />
        );
      case 'preferences':
        return (
          <ProfilePreferences
            user={user}
            userInfo={userInfo}
            loading={loading}
          />
        );
      case 'trips':
        return (
          <ProfileTrips user={user} userInfo={userInfo} loading={loading} />
        );
      case 'saved':
        return (
          <ProfileSavedPlaces
            user={user}
            userInfo={userInfo}
            loading={loading}
          />
        );
      default:
        return (
          <ProfileInfo
            user={user}
            userInfo={userInfo}
            loading={loading}
            onProfileUpdate={fetchUserProfile}
          />
        );
    }
  };

  // Enhanced animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1.0], // Enhanced easing function
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0.0, 0.2, 1.0],
      }
    }
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
        mass: 1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
      }
    }
  };

  return (
    <motion.div
      className="relative min-h-screen pb-6 sm:pb-10 md:pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced decorative background elements - optimized for better mobile display */}
      <div className="fixed top-10 left-10 w-40 sm:w-64 md:w-96 h-40 sm:h-64 md:h-96 bg-gradient-radial from-ocean/8 to-transparent rounded-full blur-3xl -z-10 animate-pulse-slow" />
      <div className="fixed bottom-20 right-5 sm:right-10 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-gradient-radial from-sunset/8 to-transparent rounded-full blur-3xl -z-10 animate-pulse-slow" />
      <div className="fixed top-1/3 right-0 md:right-1/4 w-40 sm:w-52 md:w-64 h-40 sm:h-52 md:h-64 bg-gradient-radial from-forest/8 to-transparent rounded-full blur-2xl -z-10 animate-float" />
      <div className="fixed bottom-1/3 left-0 md:left-1/4 w-48 sm:w-60 md:w-72 h-48 sm:h-60 md:h-72 bg-gradient-radial from-sand/8 to-transparent rounded-full blur-3xl -z-10 opacity-80" />

      {/* Extra subtle patterns for visual texture */}
      <div className="fixed inset-0 bg-[url('/images/roamance-logo-no-text.png')] bg-repeat opacity-[0.015] mix-blend-overlay pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="container max-w-5xl px-3 sm:px-4 py-4 sm:py-8 md:py-12 mx-auto"
      >
        <motion.div variants={itemVariants} className="mb-4 sm:mb-6 md:mb-8">
          <ProfileHeader
            user={user}
            userInfo={userInfo}
            loading={loading}
            onProfileUpdate={fetchUserProfile}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
              duration: 0.4,
            }}
            className="mt-6 sm:mt-8 md:mt-12 relative backdrop-blur-sm px-1 sm:px-2 md:px-3"
          >
            {/* Subtle tab-specific background gradients */}
            {activeTab === 'info' && (
              <div className="absolute inset-0 bg-gradient-to-tr from-ocean/5 to-transparent rounded-xl -z-10" />
            )}
            {activeTab === 'preferences' && (
              <div className="absolute inset-0 bg-gradient-to-tr from-sunset/5 to-transparent rounded-xl -z-10" />
            )}
            {activeTab === 'trips' && (
              <div className="absolute inset-0 bg-gradient-to-tr from-forest/5 to-transparent rounded-xl -z-10" />
            )}
            {activeTab === 'saved' && (
              <div className="absolute inset-0 bg-gradient-to-tr from-sand/5 to-transparent rounded-xl -z-10" />
            )}

            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
