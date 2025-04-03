import React from 'react';
import { motion } from 'framer-motion';

interface AuthFormProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthForm({ children, title, subtitle }: AuthFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="flex flex-col space-y-6 p-8 bg-card/30 backdrop-blur-xl rounded-2xl border border-border/50 shadow-lg relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-forest/5 pointer-events-none"></div>

      <div className="space-y-2 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-2xl font-bold"
        >
          {title}
        </motion.h2>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>

      {children}
    </motion.div>
  );
}
