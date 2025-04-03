import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { AuthFeatureItem } from './AuthFeatureItem';
import { GradientBadge } from '@/components/common/gradient-badge';

interface AuthHeroProps {
  badge: string;
  title: React.ReactNode;
  subtitle: string;
  features: Array<{
    icon: LucideIcon;
    text: string;
    color: 'primary' | 'sunset' | 'forest';
  }>;
}

export function AuthHero({ badge, title, subtitle, features }: AuthHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col space-y-6"
    >
      <div className="space-y-3">
        <GradientBadge>{badge}</GradientBadge>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          {title}
        </h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl leading-relaxed">
          {subtitle}
        </p>
      </div>

      <div className="flex flex-col space-y-4 mt-6">
        {features.map((feature, index) => (
          <AuthFeatureItem
            key={index}
            Icon={feature.icon}
            text={feature.text}
            color={feature.color}
          />
        ))}
      </div>

      {/* Brand Logo */}
      <div className="hidden md:flex items-center pt-8 mt-4 border-t border-border/40">
        <Image
          src="/images/roamance-logo-no-text.png"
          alt="Roamance Logo"
          width={48}
          height={48}
          className="rounded-md"
        />
        <span className="ml-3 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          Roamance
        </span>
        <p className="ml-2 text-muted-foreground">
          Where every journey becomes a story
        </p>
      </div>
    </motion.div>
  );
}
