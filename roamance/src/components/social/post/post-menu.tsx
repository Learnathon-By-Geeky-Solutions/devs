'use client';

import { Edit, Flag, MoreHorizontal, Share2, Trash2, UserPlus, Bookmark } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface PostMenuProps {
  isOwnPost: boolean;
  isSaved?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  onReport?: () => void;
  onFollow?: () => void;
  onSave?: () => void;
}

export const PostMenu = ({
  isOwnPost,
  isSaved = false,
  onEdit,
  onDelete,
  onShare,
  onReport,
  onFollow,
  onSave
}: PostMenuProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Close the menu when clicking outside of it
  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setShowMenu(false);
    }
  };

  // Add event listener for outside clicks when menu is open
  useEffect(() => {
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="flex items-center space-x-3 relative">
      {/* Save button (visible for all posts regardless of ownership) */}
      {onSave && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSave}
          className="p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors focus:outline-none"
        >
          <Bookmark className={cn(
            "h-5 w-5",
            isSaved
              ? "fill-indigo-500 text-indigo-500 dark:fill-indigo-400 dark:text-indigo-400"
              : "text-gray-500 dark:text-gray-400"
          )} />
        </motion.button>
      )}

      {/* Follow button (only shown for other users' posts) */}
      {!isOwnPost && onFollow && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onFollow}
          className="p-2 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors focus:outline-none"
        >
          <UserPlus className="h-5 w-5 text-purple-500 dark:text-purple-400" />
        </motion.button>
      )}

      {/* Menu toggle button with updated design */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMenu}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none"
      >
        <MoreHorizontal className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      </motion.button>

      {/* Dropdown menu with animation */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", duration: 0.2 }}
            className="absolute right-0 top-12 z-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg shadow-xl rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 min-w-[180px] transform origin-top-right"
          >
            <div className="py-1.5">
              {/* Owner-only actions */}
              {isOwnPost && (
                <>
                  {onEdit && (
                    <MenuItem
                      icon={<Edit className="h-4 w-4 mr-3" />}
                      label="Edit post"
                      onClick={() => {
                        setShowMenu(false);
                        onEdit();
                      }}
                    />
                  )}

                  {onDelete && (
                    <MenuItem
                      icon={<Trash2 className="h-4 w-4 mr-3" />}
                      label="Delete post"
                      onClick={() => {
                        setShowMenu(false);
                        onDelete();
                      }}
                      destructive
                    />
                  )}

                  <div className="border-t border-gray-100 dark:border-gray-700/50 my-1.5"></div>
                </>
              )}

              {/* Common actions */}
              {onShare && (
                <MenuItem
                  icon={<Share2 className="h-4 w-4 mr-3" />}
                  label="Share post"
                  onClick={() => {
                    setShowMenu(false);
                    onShare();
                  }}
                />
              )}

              {/* Save action in dropdown menu too */}
              {onSave && (
                <MenuItem
                  icon={<Bookmark className={cn(
                    "h-4 w-4 mr-3",
                    isSaved && "fill-indigo-500 text-indigo-500 dark:fill-indigo-400 dark:text-indigo-400"
                  )} />}
                  label={isSaved ? "Remove from saved" : "Save post"}
                  onClick={() => {
                    setShowMenu(false);
                    onSave();
                  }}
                />
              )}

              {/* Non-owner actions */}
              {!isOwnPost && onReport && (
                <MenuItem
                  icon={<Flag className="h-4 w-4 mr-3" />}
                  label="Report post"
                  onClick={() => {
                    setShowMenu(false);
                    onReport();
                  }}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}

const MenuItem = ({ icon, label, onClick, destructive = false }: MenuItemProps) => (
  <motion.button
    whileHover={{ x: 5, backgroundColor: destructive ? 'rgba(254, 226, 226, 0.1)' : 'rgba(243, 244, 246, 0.1)' }}
    onClick={onClick}
    className={cn(
      'flex items-center w-full px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none',
      destructive
        ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
    )}
  >
    {icon}
    {label}
  </motion.button>
);
