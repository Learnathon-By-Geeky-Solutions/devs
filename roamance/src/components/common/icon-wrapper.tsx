import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface IconWrapperProps {
  icon: LucideIcon | React.ReactNode;
  colorClass?: string;
  bgColorClass?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function IconWrapper({
  icon,
  colorClass = 'text-primary',
  bgColorClass = 'bg-primary/20',
  size = 'md',
  className,
}: IconWrapperProps) {
  const sizeClasses = {
    sm: 'p-1.5 w-fit',
    md: 'p-2.5 w-fit',
    lg: 'p-4 w-fit',
  };

  const Icon = typeof icon === 'function' ? icon : () => <>{icon}</>;

  return (
    <div
      className={cn(
        bgColorClass,
        sizeClasses[size],
        'rounded-full flex items-center justify-center',
        className
      )}
    >
      {React.isValidElement(icon) ? (
        React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
          className: cn(
            colorClass,
            (icon as React.ReactElement<{ className?: string }>).props.className
          ),
        })
      ) : typeof icon === 'function' ? (
        <Icon className={colorClass} />
      ) : null}
    </div>
  );
}
