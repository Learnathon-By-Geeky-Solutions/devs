import { RouteInstructionItem } from '@/types';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  CornerRightDown,
  CornerUpLeft,
  CornerUpRight,
  Flag,
  MoveRight,
  MoveUp,
  Navigation,
  RotateCw,
  Split,
} from 'lucide-react';
import React from 'react';

// Helper function to get turn type icon
export function getTurnTypeIcon(
  turnType: string | undefined,
  modifier: string | undefined
) {
  // If we have a modifier, it takes precedence for certain turn types
  if (modifier) {
    switch (modifier) {
      case 'Right':
        return <ArrowRight className="h-3 w-3" />;
      case 'Left':
        return <ArrowLeft className="h-3 w-3" />;
      case 'SlightRight':
        return <CornerUpRight className="h-3 w-3" />;
      case 'SlightLeft':
        return <CornerUpLeft className="h-3 w-3" />;
      case 'Straight':
        return <ArrowUp className="h-3 w-3" />;
      case 'Uturn':
        return <RotateCw className="h-3 w-3" />;
    }
  }

  // Handle based on turn type if no specific modifier or modifier didn't match
  switch (turnType) {
    case 'Head':
      return <MoveRight className="h-3 w-3" />;
    case 'Left':
      return <ArrowLeft className="h-3 w-3" />;
    case 'Right':
      return <ArrowRight className="h-3 w-3" />;
    case 'Continue':
      return <MoveUp className="h-3 w-3" />;
    case 'Uturn':
      return <RotateCw className="h-3 w-3" />;
    case 'Fork':
      return <Split className="h-3 w-3" />;
    case 'Straight':
      return <ArrowUp className="h-3 w-3" />;
    case 'Roundabout':
      return <RotateCw className="h-3 w-3 scale-75" />;
    case 'SlightLeft':
      return <CornerUpLeft className="h-3 w-3" />;
    case 'SlightRight':
      return <CornerUpRight className="h-3 w-3" />;
    case 'Merge':
      return <ArrowUpRight className="h-3 w-3" />;
    case 'EndOfRoad':
      return <CornerRightDown className="h-3 w-3" />;
    case 'DestinationReached':
      return <Flag className="h-3 w-3" />;
    default:
      return <Navigation className="h-3 w-3" />;
  }
}

// Helper function to get human-readable turn instruction
export function getTurnDescription(instruction: RouteInstructionItem): string {
  // If the instruction already has a text field, use that
  if (instruction.text) {
    return instruction.text;
  }

  // Otherwise construct a description based on type and modifier
  let description = '';

  switch (instruction.type) {
    case 'Head':
      description = `Head ${instruction.direction || ''} ${instruction.road ? 'on ' + instruction.road : ''}`;
      break;
    case 'Continue':
      description = `Continue ${instruction.modifier ? instruction.modifier.toLowerCase() : ''} ${instruction.road ? 'on ' + instruction.road : ''}`;
      break;
    case 'Uturn':
      description = `Make a U-turn ${instruction.road ? 'on ' + instruction.road : ''}`;
      break;
    case 'Fork':
      description = `Keep ${instruction.modifier ? instruction.modifier.toLowerCase() : ''} at the fork ${instruction.road ? 'onto ' + instruction.road : ''}`;
      break;
    case 'Merge':
      description = `Merge ${instruction.modifier ? instruction.modifier.toLowerCase() : ''} ${instruction.road ? 'onto ' + instruction.road : ''}`;
      break;
    case 'Roundabout':
      description = `At the roundabout, take the ${instruction.exit !== undefined ? instruction.exit + getOrdinalSuffix(instruction.exit) : ''} exit ${instruction.road ? 'onto ' + instruction.road : ''}`;
      break;
    case 'EndOfRoad':
      description = `At the end of the road, turn ${instruction.modifier ? instruction.modifier.toLowerCase() : ''} ${instruction.road ? 'onto ' + instruction.road : ''}`;
      break;
    case 'DestinationReached':
      description = 'You have reached your destination';
      break;
    default:
      // For Left, Right, SlightLeft, SlightRight, Straight
      if (
        instruction.type.includes('Left') ||
        instruction.type.includes('Right') ||
        instruction.type === 'Straight'
      ) {
        description = `Turn ${instruction.type.toLowerCase()} ${instruction.road ? 'onto ' + instruction.road : ''}`;
      } else {
        description = instruction.type;
      }
  }

  return description.trim();
}

// Helper function to get ordinal suffix for numbers (1st, 2nd, 3rd, etc.)
export function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;

  if (j === 1 && k !== 11) {
    return 'st';
  }
  if (j === 2 && k !== 12) {
    return 'nd';
  }
  if (j === 3 && k !== 13) {
    return 'rd';
  }

  return 'th';
}

// Format time utilities
export const formatTravelTime = (seconds: number): string => {
  if (!seconds) return 'Calculating...';

  // Convert seconds to minutes for display
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} h${remainingMinutes > 0 ? ' ' + remainingMinutes + ' min' : ''}`;
};

// Format time for individual step
export const formatStepTime = (seconds: number): string => {
  if (seconds < 60) return `${seconds} sec`;
  const minutes = Math.round(seconds / 60);
  return `${minutes} min`;
};
