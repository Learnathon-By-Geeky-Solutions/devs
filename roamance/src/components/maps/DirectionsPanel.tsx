'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RouteData } from '@/types';
import { motion } from 'framer-motion';
import { PanelLeftClose } from 'lucide-react';
import { DirectionPanelHeader } from './directions/DirectionPanelHeader';
import { JourneyOverview } from './directions/JourneyOverview';
import { LoadingState } from './directions/LoadingState';
import { RoutePlanning } from './directions/RoutePlanning';
import { TurnByTurnList } from './directions/TurnByTurnList';

interface DirectionsPanelProps {
  routeData: RouteData | null;
  locationName: string;
  isDarkMode: boolean;
  showDirectionsPanel: boolean;
  activeStep: number | null;
  setActiveStep: (step: number | null) => void;
  onClose: () => void;
  onChangeStartPoint?: (lat: number, lng: number, name: string) => void;
  onChangeDestination?: (lat: number, lng: number, name: string) => void;
}

export function DirectionsPanel({
  routeData,
  locationName,
  isDarkMode,
  showDirectionsPanel,
  activeStep,
  setActiveStep,
  onClose,
  onChangeStartPoint,
  onChangeDestination,
}: DirectionsPanelProps) {
  return (
    <>
      {showDirectionsPanel && (
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={cn(
            'absolute top-0 left-0 h-full w-72 md:w-80 lg:w-96 border-r overflow-y-auto z-[9999]',
            isDarkMode
              ? 'bg-background/90 backdrop-blur-xl border-muted/30'
              : 'bg-white/95 backdrop-blur-xl border-muted/20'
          )}
        >
          <div className="p-5 space-y-5">
            {/* Header Section */}
            <DirectionPanelHeader
              routeData={routeData}
              isDarkMode={isDarkMode}
              onClose={onClose}
            />

            {/* Route Planning Section */}
            <RoutePlanning
              isDarkMode={isDarkMode}
              locationName={locationName}
              onChangeStartPoint={onChangeStartPoint}
              onChangeDestination={onChangeDestination}
              setActiveStep={setActiveStep}
            />

            {/* Journey Overview and Turn by Turn Navigation */}
            {routeData && routeData.instructions && routeData.instructions.length > 0 && (
              <div className="mt-3 space-y-4">
                {/* Journey Overview Card */}
                <JourneyOverview
                  routeData={routeData}
                  locationName={locationName}
                  isDarkMode={isDarkMode}
                />

                {/* Turn-by-Turn Directions List */}
                <TurnByTurnList
                  routeData={routeData}
                  isDarkMode={isDarkMode}
                  activeStep={activeStep}
                  setActiveStep={setActiveStep}
                />
              </div>
            )}

            {/* Loading State */}
            {!routeData && <LoadingState isDarkMode={isDarkMode} />}

            {/* Hide Directions Button */}
            <Button
              variant="outline"
              className={cn(
                'w-full mt-3 border-muted/30 rounded-lg',
                isDarkMode
                  ? 'hover:bg-muted/20 transition-colors'
                  : 'hover:bg-muted/10 transition-colors'
              )}
              onClick={onClose}
            >
              <PanelLeftClose className="h-4 w-4 mr-2" />
              Hide Directions
            </Button>
          </div>
        </motion.div>
      )}
    </>
  );
}
