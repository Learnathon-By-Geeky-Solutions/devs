import { LoadingButton } from '@/components/common/loading-button';
import { motion } from 'framer-motion';

interface SaveButtonProps {
  onClick: () => Promise<void>;
  isLoading: boolean;
}

export const SaveButton = ({ onClick, isLoading }: SaveButtonProps) => {
  return (
    <motion.div
      variants={{
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
      }}
      className="flex justify-end pt-4"
    >
      <motion.div
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <LoadingButton
          variant="default"
          onClick={onClick}
          isLoading={isLoading}
          loadingText="Saving..."
          className="bg-gradient-to-r from-ocean to-ocean-dark hover:opacity-90 transition-all duration-300 text-white shadow-md px-6"
        >
          Save All Preferences
        </LoadingButton>
      </motion.div>
    </motion.div>
  );
};
