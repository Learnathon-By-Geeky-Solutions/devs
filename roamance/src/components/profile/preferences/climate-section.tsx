import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ClimatePreference } from '@/types';
import { Sun, Snowflake, CloudRain, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface ClimateSectionProps {
  selectedClimate: ClimatePreference;
  onClimateChange: (climate: ClimatePreference) => void;
}

export const ClimateSection = ({
  selectedClimate,
  onClimateChange,
}: ClimateSectionProps) => {
  const climatePreferences = [
    { id: ClimatePreference.WARM_AND_SUNNY, label: 'Warm & Sunny', icon: Sun },
    {
      id: ClimatePreference.COLD_AND_SNOWY,
      label: 'Cold & Snowy',
      icon: Snowflake,
    },
    { id: ClimatePreference.MODERATE, label: 'Moderate', icon: CloudRain },
    { id: ClimatePreference.ANY_CLIMATE, label: 'Any Climate', icon: Globe },
  ];

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
      <Card className="border-mountain/30 h-full bg-gradient-to-b from-background to-background/95 backdrop-blur-sm shadow-md overflow-hidden pt-0">
        <CardHeader className="relative pt-8 pb-3">
          <div className="absolute top-0 left-0 right-0 h-1 bg-mountain opacity-80" />
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-2 rounded-lg bg-mountain/10">
              <Sun className="h-4 w-4 text-mountain" />
            </div>
            <span>Climate Preference</span>
          </CardTitle>
          <CardDescription>
            What type of weather do you prefer?
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <RadioGroup
            value={selectedClimate}
            onValueChange={(value) => onClimateChange(value as ClimatePreference)}
            className="grid grid-cols-2 gap-3"
          >
            {climatePreferences.map((climate) => (
              <motion.div
                key={climate.id}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'relative flex items-center p-3 rounded-lg border-2 border-muted/50 cursor-pointer',
                  selectedClimate === climate.id &&
                    'border-mountain/50 bg-mountain/5'
                )}
                onClick={() => onClimateChange(climate.id)}
              >
                <RadioGroupItem
                  value={climate.id}
                  id={`climate-${climate.id}`}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                />
                <div className="ml-6 flex items-center gap-2">
                  <div
                    className={cn(
                      'p-1.5 rounded-md',
                      selectedClimate === climate.id
                        ? 'bg-mountain/10'
                        : 'bg-muted/20'
                    )}
                  >
                    <climate.icon
                      className={cn(
                        'h-4 w-4',
                        selectedClimate === climate.id
                          ? 'text-mountain'
                          : 'text-muted-foreground'
                      )}
                    />
                  </div>
                  <Label
                    htmlFor={`climate-${climate.id}`}
                    className={cn(
                      'text-sm font-medium cursor-pointer',
                      selectedClimate === climate.id && 'text-mountain'
                    )}
                  >
                    {climate.label}
                  </Label>
                </div>
              </motion.div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </motion.div>
  );
};
