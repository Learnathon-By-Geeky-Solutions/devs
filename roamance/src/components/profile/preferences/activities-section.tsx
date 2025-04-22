import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ActivityType } from '@/types';
import { Camera, Mountain, Landmark, Utensils, Film } from 'lucide-react';
import { motion } from 'framer-motion';

interface ActivitiesSectionProps {
  selectedTypes: ActivityType[];
  onTypesChange: (types: ActivityType[]) => void;
}

export const ActivitiesSection = ({
  selectedTypes,
  onTypesChange,
}: ActivitiesSectionProps) => {
  const activityTypes = [
    { id: ActivityType.SIGHTSEEING, label: 'Sightseeing', icon: Camera },
    {
      id: ActivityType.NATURE_AND_OUTDOORS,
      label: 'Nature & Outdoors',
      icon: Mountain,
    },
    {
      id: ActivityType.CULTURAL_EXPERIENCE,
      label: 'Cultural Experiences',
      icon: Landmark,
    },
    {
      id: ActivityType.FOOD_AND_DINING,
      label: 'Food & Dining',
      icon: Utensils,
    },
    { id: ActivityType.ENTERTAINMENT, label: 'Entertainment', icon: Film },
  ];

  const handleCheckChange = (checked: boolean, type: ActivityType) => {
    if (checked) {
      onTypesChange([...selectedTypes, type]);
    } else {
      onTypesChange(selectedTypes.filter(item => item !== type));
    }
  };

  return (
    <motion.div variants={{
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: 'spring',
          stiffness: 260,
          damping: 20,
        },
      },
    }}>
      <Card className="border-forest/30 h-full bg-gradient-to-b from-background to-background/95 backdrop-blur-sm shadow-md overflow-hidden pt-0">
        <CardHeader className="relative pt-8 pb-3">
          <div className="absolute top-0 left-0 right-0 h-1 bg-forest opacity-80" />
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-2 rounded-lg bg-forest/10">
              <Mountain className="h-4 w-4 text-forest" />
            </div>
            <span>Activities</span>
          </CardTitle>
          <CardDescription>
            Choose activities you enjoy while traveling
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-3">
            {activityTypes.map((type) => (
              <motion.div
                key={type.id}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'flex items-center space-x-3 p-2.5 rounded-lg border border-transparent cursor-pointer',
                  selectedTypes.includes(type.id) &&
                    'bg-forest/5 border-forest/20'
                )}
                onClick={() => handleCheckChange(!selectedTypes.includes(type.id), type.id)}
              >
                <Checkbox
                  id={`activity-${type.id}`}
                  checked={selectedTypes.includes(type.id)}
                  onCheckedChange={(checked) => handleCheckChange(!!checked, type.id)}
                  className={cn(
                    selectedTypes.includes(type.id) &&
                      'border-forest text-forest'
                  )}
                />
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      'p-1.5 rounded-md',
                      selectedTypes.includes(type.id)
                        ? 'bg-forest/10'
                        : 'bg-muted/20'
                    )}
                  >
                    <type.icon
                      className={cn(
                        'h-4 w-4',
                        selectedTypes.includes(type.id)
                          ? 'text-forest'
                          : 'text-muted-foreground'
                      )}
                    />
                  </div>
                  <Label
                    htmlFor={`activity-${type.id}`}
                    className={cn(
                      'text-sm font-medium leading-none cursor-pointer',
                      selectedTypes.includes(type.id) &&
                        'text-forest'
                    )}
                  >
                    {type.label}
                  </Label>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
