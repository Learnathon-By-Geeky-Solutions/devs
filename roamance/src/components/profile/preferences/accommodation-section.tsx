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
import { AccommodationType } from '@/types';
import { Building2, Umbrella, Tent } from 'lucide-react';
import { motion } from 'framer-motion';

interface AccommodationSectionProps {
  selectedTypes: AccommodationType[];
  onTypesChange: (types: AccommodationType[]) => void;
}

export const AccommodationSection = ({
  selectedTypes,
  onTypesChange,
}: AccommodationSectionProps) => {
  const accommodationTypes = [
    { id: AccommodationType.HOTELS, label: 'Hotels', icon: Building2 },
    { id: AccommodationType.RESORTS, label: 'Resorts', icon: Umbrella },
    { id: AccommodationType.APARTMENTS, label: 'Apartments', icon: Building2 },
    { id: AccommodationType.HOSTELS, label: 'Hostels', icon: Building2 },
    { id: AccommodationType.CAMPING, label: 'Camping', icon: Tent },
  ];

  const handleCheckChange = (checked: boolean, type: AccommodationType) => {
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
      <Card className="border-ocean/30 h-full bg-gradient-to-b from-background to-background/95 backdrop-blur-sm shadow-md overflow-hidden pt-0">
        <CardHeader className="relative pt-8 pb-3">
          <div className="absolute top-0 left-0 right-0 h-1 bg-ocean opacity-80" />
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-2 rounded-lg bg-ocean/10">
              <Building2 className="h-4 w-4 text-ocean" />
            </div>
            <span>Accommodation</span>
          </CardTitle>
          <CardDescription>
            Select your preferred places to stay
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-3">
            {accommodationTypes.map((type) => (
              <motion.div
                key={type.id}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'flex items-center space-x-3 p-2.5 rounded-lg border border-transparent',
                  selectedTypes.includes(type.id) &&
                    'bg-ocean/5 border-ocean/20'
                )}
              >
                <Checkbox
                  id={`accommodation-${type.id}`}
                  checked={selectedTypes.includes(type.id)}
                  onCheckedChange={(checked) => handleCheckChange(!!checked, type.id)}
                  className={cn(
                    selectedTypes.includes(type.id) &&
                      'border-ocean text-ocean'
                  )}
                />
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      'p-1.5 rounded-md',
                      selectedTypes.includes(type.id)
                        ? 'bg-ocean/10'
                        : 'bg-muted/20'
                    )}
                  >
                    <type.icon
                      className={cn(
                        'h-4 w-4',
                        selectedTypes.includes(type.id)
                          ? 'text-ocean'
                          : 'text-muted-foreground'
                      )}
                    />
                  </div>
                  <Label
                    htmlFor={`accommodation-${type.id}`}
                    className={cn(
                      'text-sm font-medium leading-none cursor-pointer',
                      selectedTypes.includes(type.id) &&
                        'text-ocean'
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
