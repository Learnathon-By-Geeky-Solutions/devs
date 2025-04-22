import { UserInfo, User as UserType } from '@/types';
import { motion } from 'framer-motion';
import { Calendar, Mail, MapPin, Phone, User } from 'lucide-react';
import { InfoItem } from './info-item';

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

interface ProfileViewModeProps {
  user: UserType | null;
  userInfo: UserInfo | null;
}

export function ProfileViewMode({ user, userInfo }: ProfileViewModeProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <InfoItem
          icon={Mail}
          label="Email"
          value={user?.email || ''}
          color="ocean"
        />

        <InfoItem
          icon={Phone}
          label="Phone"
          value={userInfo?.phone || ''}
          color="sunset"
          fallback="Not provided"
        />

        <InfoItem
          icon={MapPin}
          label="Location"
          value={userInfo?.location || ''}
          color="forest"
          fallback="Not specified"
        />

        <InfoItem
          icon={Calendar}
          label="Birthday"
          value={userInfo?.birthday || ''}
          color="mountain"
          fallback="Not provided"
        />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mt-8 pt-6 border-t border-muted/30"
      >
        <h3 className="text-sm font-medium text-ocean mb-3 flex items-center gap-2">
          <span className="bg-ocean/10 p-1 rounded-md">
            <User className="h-4 w-4 text-ocean" />
          </span>
          Biography
        </h3>
        <p className="text-muted-foreground leading-relaxed bg-muted/5 p-4 rounded-lg border border-muted/20 italic">
          {userInfo?.bio ||
            'No bio provided. Tell us about yourself and your travel interests!'}
        </p>
      </motion.div>
    </motion.div>
  );
}
