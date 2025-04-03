import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface AuthFeatureItemProps {
  Icon: LucideIcon;
  text: string;
  color: 'primary' | 'sunset' | 'forest';
}

export function AuthFeatureItem({ Icon, text, color }: AuthFeatureItemProps) {
  return (
    <motion.div
      whileHover={{ x: 5 }}
      className={`flex items-center space-x-4 p-3 rounded-xl bg-gradient-to-r from-${color}/5 to-transparent border border-${color}/10`}
    >
      <div className={`bg-${color}/20 p-2.5 rounded-full`}>
        <Icon className={`h-5 w-5 text-${color}`} />
      </div>
      <p className="text-muted-foreground">{text}</p>
    </motion.div>
  );
}
