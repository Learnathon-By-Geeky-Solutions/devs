import React from 'react';
import { motion } from 'framer-motion';
import { Github, GoogleIcon } from '@/components/Icons';
import { SocialAuthButton } from './SocialAuthButton';

interface SocialAuthProps {
  text?: string;
  delay?: number;
}

export function SocialAuth({
  text = 'or continue with',
  delay = 0.8,
}: SocialAuthProps) {
  return (
    <>
      <div className="relative z-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/50"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card/30 backdrop-blur-sm px-3 py-1 rounded-full text-muted-foreground">
            {text}
          </span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="grid grid-cols-2 gap-4 relative z-10"
      >
        <SocialAuthButton icon={<Github />} label="GitHub" />
        <SocialAuthButton icon={<GoogleIcon />} label="Google" />
      </motion.div>
    </>
  );
}
