import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export const PreferenceHeader = () => {
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
      <Card className="border-muted/40 bg-gradient-to-b from-background to-background/95 backdrop-blur-sm shadow-md overflow-hidden pt-0">
        <CardHeader className="relative pt-4">
          {/* Decorative accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sunset via-ocean to-forest opacity-80" />

          <div className="pt-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sunset/10 text-sunset">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl">Travel Preferences</CardTitle>
              <CardDescription>
                Personalize your travel experience
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4 bg-muted/10 p-4 rounded-lg border border-muted/30 italic">
            Customize your preferences to get personalized travel
            recommendations and a better experience with Roamance.
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
