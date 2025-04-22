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
import { CuisineType } from '@/types';
import { ChefHat, Globe, Utensils, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

interface CuisineSectionProps {
  selectedTypes: CuisineType[];
  onTypesChange: (types: CuisineType[]) => void;
}

export const CuisineSection = ({
  selectedTypes,
  onTypesChange,
}: CuisineSectionProps) => {
  const cuisineTypes = [
    { id: CuisineType.LOCAL_CUISINE, label: 'Local Cuisine', icon: ChefHat },
    { id: CuisineType.INTERNATIONAL, label: 'International', icon: Globe },
    { id: CuisineType.FINE_DINING, label: 'Fine Dining', icon: Utensils },
    { id: CuisineType.STREET_FOOD, label: 'Street Food', icon: Coffee },
    { id: CuisineType.VEGAN, label: 'Vegetarian/Vegan', icon: Utensils },
  ];

  const handleCheckChange = (checked: boolean, type: CuisineType) => {
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
      <Card className="border-sand/30 h-full bg-gradient-to-b from-background to-background/95 backdrop-blur-sm shadow-md overflow-hidden pt-0">
        <CardHeader className="relative pt-8 pb-3">
          <div className="absolute top-0 left-0 right-0 h-1 bg-sand opacity-80" />
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-2 rounded-lg bg-sand/10">
              <Utensils className="h-4 w-4 text-sand" />
            </div>
            <span>Cuisine Preferences</span>
          </CardTitle>
          <CardDescription>
            Select the types of food you prefer
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-3">
            {cuisineTypes.map((type) => (
              <motion.div
                key={type.id}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'flex items-center space-x-3 p-2.5 rounded-lg border border-transparent cursor-pointer',
                  selectedTypes.includes(type.id) &&
                    'bg-sand/5 border-sand/20'
                )}
                onClick={() => handleCheckChange(!selectedTypes.includes(type.id), type.id)}
              >
                <Checkbox
                  id={`cuisine-${type.id}`}
                  checked={selectedTypes.includes(type.id)}
                  onCheckedChange={(checked) => handleCheckChange(!!checked, type.id)}
                  className={cn(
                    selectedTypes.includes(type.id) &&
                      'border-sand text-sand'
                  )}
                />
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      'p-1.5 rounded-md',
                      selectedTypes.includes(type.id)
                        ? 'bg-sand/10'
                        : 'bg-muted/20'
                    )}
                  >
                    <type.icon
                      className={cn(
                        'h-4 w-4',
                        selectedTypes.includes(type.id)
                          ? 'text-sand'
                          : 'text-muted-foreground'
                      )}
                    />
                  </div>
                  <Label
                    htmlFor={`cuisine-${type.id}`}
                    className={cn(
                      'text-sm font-medium leading-none cursor-pointer',
                      selectedTypes.includes(type.id) &&
                        'text-sand'
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
