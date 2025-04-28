'use client';

import FileUploader from '@/components/common/file-uploader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { User } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { ImageIcon, Loader2, SendHorizontal, Video, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

interface CommentFormProps {
  currentUser?: User;
  isSubmitting?: boolean;
  onSubmit: (
    text: string,
    imagePath?: string,
    videoPath?: string
  ) => Promise<void>;
  placeholder?: string;
  autoFocus?: boolean;
}

export const CommentForm = ({
  currentUser,
  isSubmitting = false,
  onSubmit,
  placeholder = 'Write a comment...',
  autoFocus = false,
}: CommentFormProps) => {
  const [text, setText] = useState('');
  const [imagePath, setImagePath] = useState<string | undefined>();
  const [videoPath, setVideoPath] = useState<string | undefined>();
  const [showUploaderDialog, setShowUploaderDialog] = useState(false);
  const [uploaderType, setUploaderType] = useState<'image' | 'video'>('image');
  const [isExpanded, setIsExpanded] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 280;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setText(value);
      setCharCount(value.length);
    }

    if (value.length > 0 && !isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleRemoveImage = () => {
    setImagePath(undefined);
  };

  const handleRemoveVideo = () => {
    setVideoPath(undefined);
  };

  const handleSubmit = async () => {
    if (isSubmitting || text.trim() === '') return;

    try {
      await onSubmit(text, imagePath, videoPath);

      // Reset form
      setText('');
      setCharCount(0);
      setImagePath(undefined);
      setVideoPath(undefined);
      setIsExpanded(false);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div className="glass-card border-gradient border-gradient-light dark:border-gradient-dark rounded-xl overflow-hidden shadow-glass dark:shadow-glass-dark backdrop-blur-md">
      <div className="px-3.5">
        <div className="flex gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="relative h-9 w-9 rounded-full overflow-hidden flex-shrink-0 border-2 border-ocean-light dark:border-ocean shadow-soft-xl"
          >
            <Image
              src={
                currentUser?.profile_image ||
                '/images/roamance-logo-no-text.png'
              }
              alt={currentUser?.name || 'User'}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-full"
            />
          </motion.div>

          <div className="flex-1">
            <textarea
              value={text}
              onChange={handleTextChange}
              onClick={() => setIsExpanded(true)}
              placeholder={placeholder}
              rows={isExpanded ? 2 : 1}
              autoFocus={autoFocus}
              className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-100/80 dark:border-gray-700/50 resize-none focus:outline-none focus:ring-2 focus:ring-ocean/40 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 text-sm shadow-inner-soft"
            />

            {/* Character count */}
            {isExpanded && (
              <div
                className={cn(
                  'mt-1.5 text-xs text-right transition-colors pr-1',
                  charCount > MAX_CHARS * 0.8
                    ? charCount > MAX_CHARS * 0.9
                      ? 'text-sunset dark:text-sunset-light'
                      : 'text-amber-500 dark:text-amber-400'
                    : 'text-gray-400 dark:text-gray-500'
                )}
              >
                {charCount}/{MAX_CHARS}
              </div>
            )}

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  {/* Media Previews */}
                  {(imagePath || videoPath) && (
                    <div className="mt-2.5 flex gap-2">
                      {imagePath && (
                        <motion.div
                          whileHover={{ scale: 1.05, y: -2 }}
                          className="relative w-18 h-18 rounded-lg overflow-hidden border border-gray-200/80 dark:border-gray-700/60 group shadow-sm"
                        >
                          <Image
                            src={imagePath}
                            alt="Uploaded image"
                            fill
                            style={{ objectFit: 'cover' }}
                            className="transition-transform group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleRemoveImage}
                            className="absolute top-1 right-1 bg-black/60 backdrop-blur-sm text-white rounded-full h-5 w-5 flex items-center justify-center hover:bg-black/80 transition-colors shadow-sm"
                          >
                            <X className="h-3 w-3" />
                          </motion.button>
                        </motion.div>
                      )}

                      {videoPath && (
                        <motion.div
                          whileHover={{ scale: 1.05, y: -2 }}
                          className="relative w-20 h-16 rounded-lg overflow-hidden border border-gray-200/80 dark:border-gray-700/60 group shadow-sm"
                        >
                          <video
                            src={videoPath}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                            <Video className="h-5 w-5 text-white" />
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleRemoveVideo}
                            className="absolute top-1 right-1 bg-black/60 backdrop-blur-sm text-white rounded-full h-5 w-5 flex items-center justify-center hover:bg-black/80 transition-colors shadow-sm"
                          >
                            <X className="h-3 w-3" />
                          </motion.button>
                        </motion.div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="px-3.5 pb-3.5 pt-1 border-t border-gray-100/50 dark:border-gray-700/30"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {/* Buttons to open FileUploader dialog */}
                <motion.button
                  whileHover={{ scale: 1.08, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setUploaderType('image');
                    setShowUploaderDialog(true);
                  }}
                  className={cn(
                    'flex items-center gap-1 p-2 text-xs rounded-lg transition-all shadow-sm',
                    isSubmitting
                      ? 'bg-gray-100/80 dark:bg-gray-700/40 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-white/70 dark:bg-gray-800/60 text-ocean dark:text-ocean-light hover:bg-ocean/10 dark:hover:bg-ocean/20 backdrop-blur-sm'
                  )}
                  disabled={isSubmitting}
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.08, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setUploaderType('video');
                    setShowUploaderDialog(true);
                  }}
                  className={cn(
                    'flex items-center gap-1 p-2 text-xs rounded-lg transition-all shadow-sm',
                    isSubmitting
                      ? 'bg-gray-100/80 dark:bg-gray-700/40 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-white/70 dark:bg-gray-800/60 text-forest dark:text-forest-light hover:bg-forest/10 dark:hover:bg-forest/20 backdrop-blur-sm'
                  )}
                  disabled={isSubmitting}
                >
                  <Video className="h-3.5 w-3.5" />
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={isSubmitting || text.trim() === ''}
                className={cn(
                  'p-2 rounded-lg text-xs font-medium transition-all shadow-sm',
                  text.trim() !== '' && !!isSubmitting
                    ? 'bg-gradient-ocean text-white hover:opacity-90'
                    : 'bg-gray-100/80 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                )}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <SendHorizontal className="h-4 w-4" />
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploader Dialog - Modernized */}
      <Dialog open={showUploaderDialog} onOpenChange={setShowUploaderDialog}>
        <DialogContent className="w-11/12 max-w-md glass-card border-gradient border-gradient-light dark:border-gradient-dark rounded-2xl shadow-glass dark:shadow-glass-dark backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-gray-900 dark:text-white">
              {uploaderType === 'image' ? 'Upload Photo' : 'Upload Video'}
            </DialogTitle>
          </DialogHeader>
          <FileUploader
            acceptedFileTypes={uploaderType === 'image' ? 'image/*' : 'video/*'}
            multiple={false}
            showPreview={false}
            onUploadSuccess={(result) => {
              const results = Array.isArray(result) ? result : [result];
              results.forEach((res) => {
                if (res.resource_type === 'image') {
                  setImagePath(res.url);
                }
                if (res.resource_type === 'video') {
                  setVideoPath(res.url);
                }
              });
              // close uploader dialog on successful upload
              setShowUploaderDialog(false);
              toast.success('Media uploaded successfully');
            }}
            onUploadError={(err) => {
              toast.error(err.message);
              // close uploader dialog on error
              setShowUploaderDialog(false);
            }}
            onClose={() => setShowUploaderDialog(false)}
            className=""
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
