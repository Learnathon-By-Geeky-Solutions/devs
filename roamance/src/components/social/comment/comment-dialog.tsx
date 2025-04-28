'use client';

import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Post, User } from '@/types';
import { X } from 'lucide-react';
import { CommentSection } from './comment-section';
import { motion } from 'framer-motion';

interface CommentDialogProps {
  post: Post;
  currentUser?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CommentDialog = ({
  post,
  currentUser,
  open,
  onOpenChange,
}: CommentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-hidden flex flex-col p-0 glass-card border-gradient border-gradient-light dark:border-gradient-dark rounded-2xl shadow-glass dark:shadow-glass-dark backdrop-blur-md">
        <div className="p-4 border-b border-gray-100/50 dark:border-gray-800/40 flex items-center justify-between bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-t-2xl">
          <DialogHeader className="p-0 text-left">
            <DialogTitle className="text-base font-semibold bg-gradient-ocean text-transparent bg-clip-text">
              Comments
            </DialogTitle>
          </DialogHeader>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={() => onOpenChange(false)}
            className="rounded-full p-1.5 hover:bg-gray-100/80 dark:hover:bg-gray-800/60 transition-colors"
          >
            <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </motion.button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-mesh-light dark:bg-mesh-dark">
          <CommentSection
            postId={post.id}
            currentUser={currentUser}
            initialComments={post.comments}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
