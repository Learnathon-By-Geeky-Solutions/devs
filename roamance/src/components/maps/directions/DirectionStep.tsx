'use client';

import { cn } from '@/lib/utils';
import { RouteInstructionItem } from '@/types';
import { formatDistance } from '@/utils/format';
import { motion } from 'framer-motion';
import { Flag, Info, LocateFixed, Map, Timer } from 'lucide-react';
import {
  formatStepTime,
  getTurnDescription,
  getTurnTypeIcon,
} from './DirectionHelpers';

interface DirectionStepProps {
  step: RouteInstructionItem;
  index: number;
  isDarkMode: boolean;
  isActive: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  onClick: () => void;
}

export function DirectionStep({
  step,
  isDarkMode,
  isActive,
  isFirstStep,
  isLastStep,
  onClick,
}: DirectionStepProps) {
  return (
    <motion.div
      whileHover={{
        backgroundColor: isDarkMode
          ? 'rgba(255,255,255,0.1)'
          : 'rgba(0,0,0,0.02)',
      }}
      className={cn(
        'flex items-start gap-3 p-3 border-b border-muted/10 last:border-b-0 transition-colors',
        isActive
          ? isDarkMode
            ? 'bg-primary/25 border-primary/30'
            : 'bg-primary/10'
          : isDarkMode
            ? 'hover:bg-muted/20'
            : 'hover:cursor-pointer'
      )}
      onClick={onClick}
    >
      {isFirstStep ? (
        <div
          className={cn(
            'bg-blue-500 text-white h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm',
            isDarkMode
              ? 'shadow-blue-500/40 ring-1 ring-blue-400/30'
              : 'shadow-blue-500/20'
          )}
        >
          <LocateFixed className="h-3.5 w-3.5" />
        </div>
      ) : isLastStep ? (
        <div
          className={cn(
            'bg-primary text-primary-foreground h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm',
            isDarkMode
              ? 'shadow-primary/40 ring-1 ring-primary-light/30'
              : 'shadow-primary/20'
          )}
        >
          <Flag className="h-3.5 w-3.5" />
        </div>
      ) : (
        <div
          className={cn(
            'h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0',
            step.type === 'Turn'
              ? isDarkMode
                ? 'bg-sunset-dark/60 text-sunset-light ring-1 ring-sunset-light/30'
                : 'bg-sunset-light/40 text-sunset-dark'
              : isDarkMode
                ? 'bg-muted/50 text-white ring-1 ring-white/20'
                : 'bg-muted/50 text-muted-foreground'
          )}
        >
          {getTurnTypeIcon(step.type, step.modifier)}
        </div>
      )}

      <div className="flex-1">
        <p
          className={cn(
            'text-sm font-medium leading-tight',
            isDarkMode ? 'text-white/90' : 'text-foreground'
          )}
        >
          {step.text || getTurnDescription(step)}
        </p>
        {step.road && (
          <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground mt-2">
            {step.road && (
              <div
                className={cn(
                  'px-1.5 py-0.5 rounded-full flex items-center gap-1',
                  isDarkMode
                    ? 'bg-forest-dark/40 text-forest-light/90 ring-1 ring-forest-light/20'
                    : 'bg-muted/20 text-forest'
                )}
              >
                <Map className="h-3 w-3" />
                <span>{step.road}</span>
              </div>
            )}

            {step.distance && (
              <div
                className={cn(
                  'px-1.5 py-0.5 rounded-full flex items-center gap-1',
                  isDarkMode
                    ? 'bg-ocean-dark/40 text-ocean-light/90 ring-1 ring-ocean-light/20'
                    : 'bg-muted/20 text-ocean'
                )}
              >
                <Map className="h-3 w-3" />
                <span>{formatDistance(step.distance)}</span>
              </div>
            )}

            {step.time && (
              <div
                className={cn(
                  'px-1.5 py-0.5 rounded-full flex items-center gap-1',
                  isDarkMode
                    ? 'bg-sunset-dark/40 text-sunset-light/90 ring-1 ring-sunset-light/20'
                    : 'bg-muted/20 text-sunset'
                )}
              >
                <Timer className="h-3 w-3" />
                <span>{formatStepTime(step.time)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-shrink-0">
        <Info
          className={cn(
            'h-4 w-4 cursor-help transition-colors',
            isDarkMode
              ? 'text-muted-foreground/60 hover:text-white/80'
              : 'text-muted-foreground/40 hover:text-muted-foreground/80'
          )}
        />
      </div>
    </motion.div>
  );
}
