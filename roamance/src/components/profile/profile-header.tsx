'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { routes } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { User, UserInfo } from '@/types';
import { getDateParts, getMonthName } from '@/utils/format';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Camera, Home, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { FileUploader } from '@/components/common/file-uploader';
import { userService } from '@/service/user-service';
import { CloudinaryUploadResult } from '@/service/cloudinary-service';
import { authService } from '@/service/auth-service';

interface ProfileHeaderProps {
  user: User | null;
  userInfo: UserInfo | null;
  loading: boolean;
  onProfileUpdate?: () => void;
}

export function ProfileHeader({
  user,
  userInfo,
  loading,
  onProfileUpdate,
}: ProfileHeaderProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadSuccessful, setUploadSuccessful] = useState(false);

  // New state for cover image upload
  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const [isCoverUploadDialogOpen, setIsCoverUploadDialogOpen] = useState(false);
  const [coverUploadSuccessful, setCoverUploadSuccessful] = useState(false);

  // Calculate initials for avatar fallback
  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleUploadSuccess = async (result: CloudinaryUploadResult) => {
    if (!user) return;

    try {
      setIsUploading(true);

      // Update basic user profile with new profile image
      await userService.updateUserProfile({
        profile_image: result.url,
      });

      toast.success('Profile picture updated successfully');

      // Mark that upload was successful, but don't call onProfileUpdate yet
      setUploadSuccessful(true);
    } catch (error) {
      console.error('Failed to update profile picture:', error);
      toast.error('Failed to update profile picture');
      setUploadSuccessful(false);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle dialog close event
  const handleDialogOpenChange = (open: boolean) => {
    setIsUploadDialogOpen(open);

    // When dialog is closed and there was a successful upload, refresh the profile
    if (!open && uploadSuccessful) {
      if (onProfileUpdate) {
        onProfileUpdate();
      }
      // Reset the flag
      setUploadSuccessful(false);
    }
  };

  // Handle FileUploader's close button click
  const handleUploaderClose = () => {
    setIsUploadDialogOpen(false);
  };

  const handleUploadError = (error: Error) => {
    console.error('Upload failed:', error);
    toast.error('Image upload failed: ' + error.message);
    setUploadSuccessful(false);
  };

  // Cover image upload functions
  const handleCoverUploadSuccess = async (result: CloudinaryUploadResult) => {
    if (!user) return;

    try {
      setIsCoverUploading(true);

      // Update user info with new cover image
      await userService.updateUserInfo({
        ...userInfo,
        cover_image: result.url,
      });

      toast.success('Cover image updated successfully');

      // Mark that upload was successful, but don't call onProfileUpdate yet
      setCoverUploadSuccessful(true);
    } catch (error) {
      console.error('Failed to update cover image:', error);
      toast.error('Failed to update cover image');
      setCoverUploadSuccessful(false);
    } finally {
      setIsCoverUploading(false);
    }
  };

  // Handle cover dialog close event
  const handleCoverDialogOpenChange = (open: boolean) => {
    setIsCoverUploadDialogOpen(open);

    // When dialog is closed and there was a successful upload, refresh the profile
    if (!open && coverUploadSuccessful) {
      if (onProfileUpdate) {
        onProfileUpdate();
      }
      // Reset the flag
      setCoverUploadSuccessful(false);
    }
  };

  // Handle cover FileUploader's close button click
  const handleCoverUploaderClose = () => {
    setIsCoverUploadDialogOpen(false);

    // When closed with successful upload, refresh the profile
    if (coverUploadSuccessful) {
      if (onProfileUpdate) {
        onProfileUpdate();
      }
      // Reset the flag
      setCoverUploadSuccessful(false);
    }
  };

  const handleCoverUploadError = (error: Error) => {
    console.error('Cover upload failed:', error);
    toast.error('Cover image upload failed: ' + error.message);
    setCoverUploadSuccessful(false);
  };

  // Add logout handler
  const handleLogout = () => {
    try {
      authService.logout();
      toast.success('Successfully logged out');
      router.push(routes.signIn.href);
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to log out');
    }
  };

  return (
    <div className="relative">
      {/* Enhanced decorative elements with more subtle animations */}
      <div className="absolute top-0 right-0 w-1/3 h-64 rounded-full opacity-30 blur-3xl -z-10 bg-gradient-to-br from-ocean/30 via-sunset/20 to-forest/40 animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 w-1/4 h-48 rounded-full opacity-25 blur-3xl -z-10 bg-gradient-to-tr from-forest/30 via-sand/20 to-sunset/30 animate-pulse-slow" />
      <div className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full opacity-20 blur-3xl -z-10 bg-gradient-to-r from-mountain/20 to-ocean/30 animate-float" />

      {/* Profile image upload dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-md border border-muted/30 bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-ocean to-forest bg-clip-text text-transparent">
              Update Profile Picture
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Upload a new profile picture from your device or camera
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <FileUploader
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              acceptedFileTypes="image/*"
              maxSizeMB={5}
              buttonText={isUploading ? 'Uploading...' : 'Select Profile Image'}
              className="w-full"
              showPreview={true}
              onClose={handleUploaderClose}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Cover image upload dialog - with enhanced styling */}
      <Dialog
        open={isCoverUploadDialogOpen}
        onOpenChange={handleCoverDialogOpenChange}
      >
        <DialogContent className="sm:max-w-md border border-muted/30 bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-sunset to-ocean bg-clip-text text-transparent">
              Update Cover Image
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Upload a new cover image from your device
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <FileUploader
              onUploadSuccess={handleCoverUploadSuccess}
              onUploadError={handleCoverUploadError}
              acceptedFileTypes="image/*"
              maxSizeMB={5}
              buttonText={
                isCoverUploading ? 'Uploading...' : 'Select Cover Image'
              }
              className="w-full"
              showPreview={true}
              onClose={handleCoverUploaderClose}
            />
          </div>
        </DialogContent>
      </Dialog>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={cn(
          'relative overflow-hidden rounded-xl md:rounded-2xl border border-muted/20',
          'bg-gradient-to-r from-background/80 via-background/70 to-background/90',
          'backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow duration-500'
        )}
      >
        {/* Adjusted height for responsiveness */}
        <div className="h-28 sm:h-36 md:h-48 relative overflow-hidden">
          {/* Enhanced cover image with overlay effects */}
          <div className="cover-image-container group">
            {userInfo?.cover_image ? (
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 hover:scale-105"
                style={{ backgroundImage: `url(${userInfo.cover_image})` }}
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-ocean/80 via-sunset/70 to-forest/80 opacity-90" />
                <div className="absolute inset-0 opacity-20 bg-[url('/images/roamance-logo-no-text.png')] bg-repeat-space bg-contain mix-blend-overlay animate-pulse-slow" />
              </>
            )}

            {/* Improved overlay for hover effect with smoother transitions */}
            <div
              className={`absolute inset-0 transition-all duration-500 ${
                isCoverUploading
                  ? 'bg-black/40'
                  : 'bg-black/10 group-hover:bg-black/30'
              } flex items-center justify-center`}
            >
              {/* Change cover button with improved styling and responsiveness */}
              {!loading && (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`
                    absolute bottom-2 right-2 sm:bottom-4 sm:right-4
                    bg-white/20 hover:bg-white/40 text-white
                    border border-white/30
                    transition-all duration-300
                    opacity-0 group-hover:opacity-100
                    backdrop-blur-md shadow-md
                    text-xs sm:text-sm /* Adjusted text size */
                    px-2 py-1 sm:px-3 sm:py-1.5 /* Adjusted padding */
                    ${isCoverUploading ? 'pointer-events-none' : ''}
                  `}
                  onClick={() =>
                    !isCoverUploading && setIsCoverUploadDialogOpen(true)
                  }
                >
                  {isCoverUploading ? (
                    <>
                      {/* Adjusted spinner size */}
                      <span className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span className="hidden sm:inline">Updating...</span>
                      <span className="inline sm:hidden">...</span> {/* Shorter text for mobile */}
                    </>
                  ) : (
                    <>
                      {/* Adjusted icon size */}
                      <Camera className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                      <span className="hidden sm:inline">Change Cover</span>
                      <span className="inline sm:hidden">Cover</span> {/* Shorter text for mobile */}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Header controls with improved glass effect and responsive sizing */}
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center gap-1 sm:gap-2 z-10"> {/* Adjusted gap */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              // Adjusted size for responsiveness
              className="h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-white/30 hover:bg-white/50 backdrop-blur-md border border-white/30 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center overflow-hidden"
            >
              <ThemeToggle className="h-full w-full text-white bg-transparent hover:bg-transparent border-none shadow-none" />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Button
                variant="ghost"
                size="icon"
                // Adjusted size for responsiveness
                className="h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-white/30 hover:bg-white/50 backdrop-blur-md text-white border border-white/30 transition-all duration-300 shadow-md hover:shadow-lg"
                onClick={() => router.back()}
                aria-label="Go back"
              >
                {/* Adjusted icon size */}
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Button
                variant="ghost"
                size="icon"
                // Adjusted size for responsiveness
                className="h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-white/30 hover:bg-white/50 backdrop-blur-md text-white border border-white/30 transition-all duration-300 shadow-md hover:shadow-lg"
                onClick={() => router.push(routes.home.href)}
                aria-label="Go to homepage"
              >
                {/* Adjusted icon size */}
                <Home className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </motion.div>

            {/* Add Logout Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-white/30 hover:bg-red-500/50 backdrop-blur-md text-white border border-white/30 transition-all duration-300 shadow-md hover:shadow-lg"
                onClick={handleLogout}
                aria-label="Log out"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Adjusted padding, margin-top, and gap for responsiveness */}
        <div className="flex flex-col md:flex-row px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 md:pb-10 -mt-12 sm:-mt-14 md:-mt-20 gap-4 sm:gap-5 md:gap-6 md:items-end relative z-10">
          <div className="flex-shrink-0 relative group mx-auto md:mx-0">
            {loading ? (
              // Adjusted skeleton size for responsiveness
              <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 md:w-40 md:h-40 rounded-full border-4 border-background shadow-xl" />
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                whileHover={{
                  boxShadow:
                    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                }}
              >
                {/* Adjusted avatar size for responsiveness */}
                <Avatar className="w-24 h-24 sm:w-28 sm:h-28 md:w-40 md:h-40 border-4 border-background shadow-xl ring-2 ring-muted/20 ring-offset-2 ring-offset-background transition-all duration-500">
                  <AvatarImage
                    src={user?.profile_image || undefined}
                    alt={user?.name || 'User'}
                    className="object-cover"
                  />
                  {/* Adjusted fallback text size */}
                  <AvatarFallback className="bg-gradient-to-br from-ocean to-ocean-dark text-xl sm:text-2xl md:text-4xl text-white font-light">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`
                    absolute inset-0 bg-black/40 rounded-full
                    transition-all duration-300
                    flex items-center justify-center backdrop-blur-sm
                    ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                    ${isUploading ? 'cursor-wait' : 'cursor-pointer'}
                  `}
                  onClick={() => !isUploading && setIsUploadDialogOpen(true)}
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    // Adjusted padding for responsiveness
                    className="bg-white/30 p-2 sm:p-3 rounded-full backdrop-blur-md shadow-lg"
                  >
                    {isUploading ? (
                      // Adjusted spinner size for responsiveness
                      <div className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                      // Adjusted icon size for responsiveness
                      <Camera className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Adjusted spacing and text alignment for responsiveness */}
          <div className="flex-grow space-y-3 sm:space-y-4 mt-1 sm:mt-2 md:mt-24 text-center md:text-left">
            {loading ? (
              <>
                {/* Adjusted skeleton sizes for responsiveness */}
                <Skeleton className="h-6 sm:h-7 md:h-8 w-36 sm:w-40 md:w-48 mx-auto md:mx-0" />
                <Skeleton className="h-3 sm:h-4 w-48 sm:w-56 md:w-64 mx-auto md:mx-0" />
                <div className="flex gap-2 mt-2 justify-center md:justify-start">
                  <Skeleton className="h-5 sm:h-6 w-20 sm:w-24" />
                  <Skeleton className="h-5 sm:h-6 w-24 sm:w-28" />
                </div>
              </>
            ) : (
              <>
                {/* Adjusted gap and alignment for responsiveness */}
                <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center md:justify-between gap-2 sm:gap-3 md:gap-4">
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    // Adjusted text size for responsiveness
                    className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-ocean via-foreground to-foreground bg-clip-text text-transparent tracking-tight mx-auto md:mx-0"
                  >
                    {user?.name || 'Traveler'}
                  </motion.h1>
                  {userInfo?.location && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      // Adjusted padding, gap, and alignment for responsiveness
                      className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-background/70 backdrop-blur-sm border border-muted/30 shadow-sm mx-auto md:mx-0"
                    >
                      {/* Adjusted icon size */}
                      <Home className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-ocean" />
                      {/* Adjusted text size */}
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                        {userInfo.location}
                      </p>
                    </motion.div>
                  )}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  // Ensure badge is centered on mobile, left-aligned on larger screens
                  className="relative flex justify-center md:justify-start"
                >
                  <Badge
                    variant="outline"
                    // Adjusted padding, gap, and text size for responsiveness
                    className="flex gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 bg-gradient-to-r from-ocean/20 to-ocean/5 border-ocean/20 text-ocean-dark backdrop-blur-sm hover:bg-ocean/20 transition-all duration-300 group text-xs sm:text-sm"
                  >
                    {/* Adjusted icon size */}
                    <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 group-hover:animate-pulse" />
                    <span className="font-medium">
                      Joined{' '}
                      {`${getMonthName(getDateParts(user?.audit.created_at || '').month)} ${getDateParts(user?.audit.created_at || '').year}` ||
                        'April 20XX'}
                    </span>
                  </Badge>
                  {/* Adjusted decorative element size */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-tr from-ocean/30 to-transparent rounded-full blur-lg opacity-70"></div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
