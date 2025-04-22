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
import { Map, Mountain, Umbrella } from 'lucide-react';
import { TravelStyle } from '@/types';
import { motion } from 'framer-motion';

interface TravelStyleSectionProps {
  selectedStyle: TravelStyle;
  onStyleChange: (style: TravelStyle) => void;
}

export const TravelStyleSection = ({
  selectedStyle,
  onStyleChange,
}: TravelStyleSectionProps) => {
  const travelStyles = [
    {
      id: TravelStyle.RELAXED,
      label: 'Relaxed & Easy',
      icon: Umbrella,
      description: 'Take it slow and enjoy the moment',
    },
    {
      id: TravelStyle.BALANCED,
      label: 'Balanced Mix',
      icon: Map,
      description: 'Balance between activities and relaxation',
    },
    {
      id: TravelStyle.ADVENTUROUS,
      label: 'Adventurous',
      icon: Mountain,
      description: 'Seek thrills and unique experiences',
    },
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
      <Card className="border-sunset/30 overflow-hidden bg-gradient-to-b from-background to-background/95 backdrop-blur-sm shadow-md pt-0">
        <CardHeader className="relative pt-8 pb-3">
          {/* Decorative accent pattern */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-sunset opacity-80" />

          <CardTitle className="text-xl flex items-center gap-2">
            <div className="p-2 rounded-lg bg-sunset/10">
              <Map className="h-5 w-5 text-sunset" />
            </div>
            <span>Travel Style</span>
          </CardTitle>
          <CardDescription>Choose how you like to travel</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <RadioGroup
            value={selectedStyle}
            onValueChange={(value) =>
              onStyleChange(value as TravelStyle)
            }
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {travelStyles.map((style) => (
              <motion.div
                key={style.id}
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Label
                  htmlFor={style.id}
                  className={cn(
                    'flex flex-col items-center justify-center rounded-xl border-2 border-muted/50 bg-gradient-to-b from-background/80 to-background/60 backdrop-blur-sm p-5 cursor-pointer hover:shadow-md transition-all duration-300',
                    selectedStyle === style.id &&
                      'border-sunset/70 bg-sunset/5 shadow-lg ring-1 ring-sunset/30'
                  )}
                >
                  <RadioGroupItem
                    value={style.id}
                    id={style.id}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center mb-3',
                      selectedStyle === style.id
                        ? 'bg-sunset/20'
                        : 'bg-muted/20'
                    )}
                  >
                    <style.icon
                      className={cn(
                        'h-6 w-6',
                        selectedStyle === style.id
                          ? 'text-sunset'
                          : 'text-muted-foreground'
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      'font-medium text-base',
                      selectedStyle === style.id && 'text-sunset'
                    )}
                  >
                    {style.label}
                  </span>
                  <span className="text-xs text-muted-foreground text-center mt-2">
                    {style.description}
                  </span>
                </Label>
              </motion.div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </motion.div>
  );
};
