'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { User as UserType, UserInfo } from '@/types';
import { motion } from 'framer-motion';
import { Edit2, User } from 'lucide-react';
import { useState } from 'react';
import { ProfileEditForm } from './profile-edit-form';
import { ProfileViewMode } from './profile-view-mode';

interface ProfileInfoProps {
  user: UserType | null;
  userInfo: UserInfo | null;
  loading: boolean;
  onProfileUpdate?: () => void;
}

export function ProfileInfo({ user, userInfo, loading, onProfileUpdate }: ProfileInfoProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Animation variants for loading state
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const handleEditComplete = () => {
    setIsEditing(false);
    if (onProfileUpdate) {
      onProfileUpdate();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-8"
    >
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-gradient-radial from-ocean/5 to-transparent rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-gradient-radial from-sunset/5 to-transparent rounded-full blur-2xl -z-10" />

      <Card className="border-muted/40 bg-gradient-to-b from-background to-background/90 backdrop-blur-sm shadow-md overflow-hidden pt-0">
        <CardHeader className="relative px-6 pt-4 pb-0">
          {/* Decorative accent line on top of the card */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-ocean via-sunset to-forest opacity-80" />

          <div className="flex items-center justify-between pt-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="bg-ocean/10 p-1.5 rounded-md">
                  <User className="h-5 w-5 text-ocean" />
                </span>
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription className="mt-1.5">
                Update your personal details and contact information
              </CardDescription>
            </div>

            {!isEditing && !loading && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
                className="bg-background/80 border-ocean/30 text-ocean hover:bg-ocean/10 hover:text-ocean-dark transition-all duration-300 flex gap-1.5 items-center"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Edit Info</span>
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="px-6 pt-6">
          {loading ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-5"
            >
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="flex flex-col space-y-2"
                  >
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </motion.div>
                ))}
            </motion.div>
          ) : isEditing ? (
            <ProfileEditForm
              user={user}
              userInfo={userInfo}
              onCancel={() => setIsEditing(false)}
              onComplete={handleEditComplete}
            />
          ) : (
            <ProfileViewMode user={user} userInfo={userInfo} />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
