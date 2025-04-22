import { LoadingButton } from '@/components/common/loading-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User as UserType, UserInfo } from '@/types';
import { userService } from '@/service/user-service';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Animation variants
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

interface ProfileEditFormProps {
  user: UserType | null;
  userInfo: UserInfo | null;
  onCancel: () => void;
  onComplete?: () => void;
}

export function ProfileEditForm({ user, userInfo, onCancel, onComplete }: ProfileEditFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: userInfo?.phone || '',
    bio: userInfo?.bio || '',
    location: userInfo?.location || '',
    birthday: userInfo?.birthday || '',
  });

  useEffect(() => {
    if (user) {
      setFormData(prevState => ({
        ...prevState,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    if (userInfo) {
      setFormData(prevState => ({
        ...prevState,
        phone: userInfo.phone || '',
        bio: userInfo.bio || '',
        location: userInfo.location || '',
        birthday: userInfo.birthday || '',
      }));
    }
  }, [userInfo]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);

      // Extract profile and extended info data from form
      const profileData: Partial<UserType> = {
        name: formData.name,
      };
      const userInfoData: Partial<UserInfo> = {
        phone: formData.phone,
        bio: formData.bio,
        location: formData.location,
        birthday: formData.birthday,
        user_id: user?.id,
      };

      // Update basic profile and extended info in parallel
      await Promise.all([
        userService.updateUserProfile(profileData),
        userService.updateUserInfo(userInfoData),
      ]);

      toast.success('Your profile has been updated');

      if (onComplete) {
        onComplete();
      } else {
        onCancel(); // Exit editing mode
      }
    } catch (error) {
      console.error('Failed to update profile', error);
      toast.error('Failed to update your profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <motion.div variants={itemVariants} className="space-y-2.5">
          <Label
            htmlFor="name"
            className="text-sm font-medium text-muted-foreground"
          >
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="border-muted/50 focus:border-ocean focus:ring-1 focus:ring-ocean/30 bg-background/80 backdrop-blur-sm transition-colors"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2.5">
          <Label
            htmlFor="email"
            className="text-sm font-medium text-muted-foreground"
          >
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="border-muted/50 focus:border-ocean focus:ring-1 focus:ring-ocean/30 bg-background/80 backdrop-blur-sm transition-colors"
            disabled={true}
            title="Email address cannot be changed"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2.5">
          <Label
            htmlFor="phone"
            className="text-sm font-medium text-muted-foreground"
          >
            Phone Number
          </Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 123-4567"
            className="border-muted/50 focus:border-sunset focus:ring-1 focus:ring-sunset/30 bg-background/80 backdrop-blur-sm transition-colors"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2.5">
          <Label
            htmlFor="location"
            className="text-sm font-medium text-muted-foreground"
          >
            Location
          </Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="New York, USA"
            className="border-muted/50 focus:border-forest focus:ring-1 focus:ring-forest/30 bg-background/80 backdrop-blur-sm transition-colors"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2.5">
          <Label
            htmlFor="birthday"
            className="text-sm font-medium text-muted-foreground"
          >
            Birthday
          </Label>
          <Input
            id="birthday"
            name="birthday"
            type="date"
            value={formData.birthday}
            onChange={handleChange}
            className="border-muted/50 focus:border-mountain focus:ring-1 focus:ring-mountain/30 bg-background/80 backdrop-blur-sm transition-colors"
          />
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="space-y-2.5">
        <Label
          htmlFor="bio"
          className="text-sm font-medium text-muted-foreground"
        >
          Bio
        </Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself and your travel interests..."
          rows={4}
          className="border-muted/50 focus:border-ocean focus:ring-1 focus:ring-ocean/30 bg-background/80 backdrop-blur-sm transition-colors resize-none"
        />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex justify-end gap-3 border-t border-muted/30 mt-6 pt-4"
      >
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-muted/50 hover:bg-muted/20"
        >
          Cancel
        </Button>
        <LoadingButton
          type="submit"
          variant="default"
          isLoading={isSaving}
          loadingText="Saving..."
          className="bg-gradient-to-r from-ocean to-ocean-dark hover:opacity-90 text-white shadow-md"
        >
          Save Changes
        </LoadingButton>
      </motion.div>
    </motion.form>
  );
}
