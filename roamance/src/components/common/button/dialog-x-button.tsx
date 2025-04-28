import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';

type DialogXButtonSize = 'sm' | 'default' | 'lg' | 'xl';
type DialogXButtonVariant =
  | 'default'
  | 'ocean'
  | 'sunset'
  | 'forest'
  | 'violet'
  | 'lavender'
  | 'sand'
  | 'white';
type DialogXButtonHoverEffect = 'none' | 'rotate' | 'scale' | 'pulse';

type DialogXButtonProps = React.ComponentProps<typeof DialogPrimitive.Close> & {
  onClick?: () => void;
  className?: string;
  size?: DialogXButtonSize;
  variant?: DialogXButtonVariant;
  hoverEffect?: DialogXButtonHoverEffect;
};

export const DialogXButton = ({
  className,
  onClick,
  size = 'default',
  variant = 'ocean',
  hoverEffect = 'scale',
  ...props
}: DialogXButtonProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    default: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    default: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  };

  const variantClasses = {
    default: 'text-muted-foreground hover:text-foreground',
    ocean: 'text-ocean-light hover:text-ocean hover:bg-ocean/10',
    sunset: 'text-sunset-light hover:text-sunset hover:bg-sunset/10',
    forest: 'text-forest-light hover:text-forest hover:bg-forest/10',
    violet: 'text-violet-light hover:text-violet hover:bg-violet/10',
    lavender: 'text-lavender-light hover:text-lavender hover:bg-lavender/10',
    sand: 'text-sand-light hover:text-sand hover:bg-sand/10',
    white: 'text-white/70 hover:text-white hover:bg-white/10',
  };

  const hoverEffectClasses = {
    none: '',
    rotate: 'hover:rotate-90 transition-transform duration-300 transform',
    scale: 'hover:scale-110 transition-transform duration-300 transform',
    pulse: 'hover:animate-pulse-slow',
  };

  return (
    <DialogPrimitive.Close asChild {...props} onClick={onClick}>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'rounded-full transition-all',
          sizeClasses[size],
          variantClasses[variant],
          hoverEffectClasses[hoverEffect],
          className
        )}
      >
        <X className={iconSizes[size]} />
        <span className="sr-only">Close</span>
      </Button>
    </DialogPrimitive.Close>
  );
};

// Export the type
export type { DialogXButtonProps };
