import React from 'react';
import { Button } from '@/components/ui/button';

interface SocialAuthButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export function SocialAuthButton({
  icon,
  label,
  onClick,
}: SocialAuthButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className="w-full flex gap-2 border-border/50 bg-background/50 backdrop-blur-sm hover:bg-primary/5 hover:text-foreground transition-all duration-300"
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
}
