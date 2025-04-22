'use client';

import { cn } from '@/lib/utils';
import { RouteData } from '@/types';
import { Navigation } from 'lucide-react';
import { DirectionStep } from './DirectionStep';

interface TurnByTurnListProps {
  routeData: RouteData;
  isDarkMode: boolean;
  activeStep: number | null;
  setActiveStep: (step: number | null) => void;
}

export function TurnByTurnList({
  routeData,
  isDarkMode,
  activeStep,
  setActiveStep,
}: TurnByTurnListProps) {
  if (
    !routeData ||
    !routeData.instructions ||
    routeData.instructions.length === 0
  ) {
    return null;
  }

  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden border',
        isDarkMode ? 'bg-card/80 border-muted/40' : 'bg-card/80 border-muted/30'
      )}
    >
      <div className="p-4 border-b border-muted/10">
        <h3
          className={cn(
            'text-base font-medium flex items-center gap-2',
            isDarkMode ? 'text-white' : 'text-foreground'
          )}
        >
          <Navigation
            className={cn(
              'h-4 w-4',
              isDarkMode ? 'text-primary-light' : 'text-primary/70'
            )}
          />
          Turn-by-Turn Directions
        </h3>
      </div>

      {/* Directions List */}
      <div className="max-h-[400px] overflow-y-auto">
        {routeData.instructions.map((step, index) => (
          <DirectionStep
            key={`step-${index}`}
            step={step}
            index={index}
            isDarkMode={isDarkMode}
            isActive={activeStep === index}
            isFirstStep={index === 0}
            isLastStep={index === routeData.instructions.length - 1}
            onClick={() => setActiveStep(index)}
          />
        ))}
      </div>
    </div>
  );
}
