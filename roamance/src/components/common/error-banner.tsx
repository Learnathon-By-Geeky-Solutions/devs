import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface ErrorBannerProps {
  message: string | null;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-destructive/10 text-destructive p-3 rounded-md text-sm flex items-center gap-2 relative z-10"
    >
      <AlertCircle size={16} />
      <p>{message}</p>
    </motion.div>
  );
}
