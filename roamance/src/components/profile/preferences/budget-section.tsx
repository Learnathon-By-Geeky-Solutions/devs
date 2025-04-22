import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { BudgetLevel } from '@/types';
import { Plane } from 'lucide-react';
import { motion } from 'framer-motion';

interface BudgetSectionProps {
  budgetLevel: BudgetLevel;
  onBudgetChange: (level: BudgetLevel) => void;
}

export const BudgetSection = ({
  budgetLevel,
  onBudgetChange,
}: BudgetSectionProps) => {
  // Map budget level to UI values
  const getBudgetIndex = (level: BudgetLevel): number => {
    const budgetMap: Record<BudgetLevel, number> = {
      [BudgetLevel.BUDGET]: 0,
      [BudgetLevel.ECONOMIC]: 1,
      [BudgetLevel.MODERATE]: 2,
      [BudgetLevel.PREMIUM]: 3,
      [BudgetLevel.LUXURY]: 4,
    };
    return budgetMap[level];
  };

  const getBudgetLevelFromIndex = (index: number): BudgetLevel => {
    const indexMap: Record<number, BudgetLevel> = {
      0: BudgetLevel.BUDGET,
      1: BudgetLevel.ECONOMIC,
      2: BudgetLevel.MODERATE,
      3: BudgetLevel.PREMIUM,
      4: BudgetLevel.LUXURY,
    };
    return indexMap[index];
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
      <Card className="border-ocean/30 overflow-hidden bg-gradient-to-b from-background to-background/95 backdrop-blur-sm shadow-md pt-0">
        <CardHeader className="relative pt-8 pb-3">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-ocean to-ocean-dark opacity-80" />
          <CardTitle className="text-xl flex items-center gap-2">
            <div className="p-2 rounded-lg bg-ocean/10">
              <Plane className="h-5 w-5 text-ocean" />
            </div>
            <span>Travel Budget</span>
          </CardTitle>
          <CardDescription>
            Select your typical budget level for trips
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="space-y-8">
            <div>
              <div className="flex justify-between mb-2">
                <div>
                  <Badge
                    variant="outline"
                    className="border-ocean/30 bg-ocean/5 text-ocean"
                  >
                    Budget Level:{' '}
                    {getBudgetIndex(budgetLevel) + 1}/5
                  </Badge>
                </div>
              </div>
              <Slider
                value={[getBudgetIndex(budgetLevel)]}
                min={0}
                max={4}
                step={1}
                onValueChange={([value]) =>
                  onBudgetChange(getBudgetLevelFromIndex(value))
                }
                className="py-4"
              />
            </div>

            <div className="grid grid-cols-5 gap-2 text-center">
              <motion.div
                className={cn(
                  'text-sm p-3 rounded-lg border-2 border-transparent transition-all cursor-pointer',
                  budgetLevel === BudgetLevel.BUDGET &&
                    'border-ocean/30 bg-ocean/5'
                )}
                whileHover={{ y: -3 }}
                onClick={() => onBudgetChange(BudgetLevel.BUDGET)}
              >
                <div className="font-medium">Budget</div>
                <div className="text-muted-foreground text-xs mt-1">
                  Hostels & street food
                </div>
              </motion.div>
              <motion.div
                className={cn(
                  'text-sm p-3 rounded-lg border-2 border-transparent transition-all cursor-pointer',
                  budgetLevel === BudgetLevel.ECONOMIC &&
                    'border-ocean/30 bg-ocean/5'
                )}
                whileHover={{ y: -3 }}
                onClick={() => onBudgetChange(BudgetLevel.ECONOMIC)}
              >
                <div className="font-medium">Economic</div>
                <div className="text-muted-foreground text-xs mt-1">
                  3-star hotels
                </div>
              </motion.div>
              <motion.div
                className={cn(
                  'text-sm p-3 rounded-lg border-2 border-transparent transition-all cursor-pointer',
                  budgetLevel === BudgetLevel.MODERATE &&
                    'border-ocean/30 bg-ocean/5'
                )}
                whileHover={{ y: -3 }}
                onClick={() => onBudgetChange(BudgetLevel.MODERATE)}
              >
                <div className="font-medium">Moderate</div>
                <div className="text-muted-foreground text-xs mt-1">
                  4-star hotels
                </div>
              </motion.div>
              <motion.div
                className={cn(
                  'text-sm p-3 rounded-lg border-2 border-transparent transition-all cursor-pointer',
                  budgetLevel === BudgetLevel.PREMIUM &&
                    'border-ocean/30 bg-ocean/5'
                )}
                whileHover={{ y: -3 }}
                onClick={() => onBudgetChange(BudgetLevel.PREMIUM)}
              >
                <div className="font-medium">Premium</div>
                <div className="text-muted-foreground text-xs mt-1">
                  5-star hotels
                </div>
              </motion.div>
              <motion.div
                className={cn(
                  'text-sm p-3 rounded-lg border-2 border-transparent transition-all cursor-pointer',
                  budgetLevel === BudgetLevel.LUXURY &&
                    'border-ocean/30 bg-ocean/5'
                )}
                whileHover={{ y: -3 }}
                onClick={() => onBudgetChange(BudgetLevel.LUXURY)}
              >
                <div className="font-medium">Luxury</div>
                <div className="text-muted-foreground text-xs mt-1">
                  High-end experiences
                </div>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
