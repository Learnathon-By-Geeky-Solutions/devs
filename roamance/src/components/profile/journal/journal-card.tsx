import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { JournalBrief } from '@/types/journal';
import { formatRelativeTime } from '@/utils';
import { motion } from 'framer-motion';
import {
  Archive,
  ArchiveRestore,
  BookOpen,
  CalendarIcon,
  Clock,
  Edit,
  ExternalLink,
  GripVertical,
  ImageIcon,
  Lock,
  MapPin,
  MoreHorizontal,
  Route,
  Share2,
  Star,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { getJournalColorScheme } from './colorscheme';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface JournalCardProps {
  journal: JournalBrief;
  onEdit: (journal: JournalBrief) => void;
  onDelete: (journal: JournalBrief) => void;
  onView: (journal: JournalBrief) => void;
  onToggleFavorite: (journal: JournalBrief) => void;
  onToggleArchive: (journal: JournalBrief) => void;
}

export const JournalCard: React.FC<JournalCardProps> = ({
  journal,
  onEdit,
  onView,
  onToggleFavorite,
  onToggleArchive,
  onDelete,
}) => {
  // Get consistent color scheme based on journal title
  const colorScheme = getJournalColorScheme(journal.title);

  // Format created date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get CSS classes based on the color scheme
  const getCardStyles = () => {
    const baseGradient = 'bg-gradient-to-tr';
    const basePattern = "bg-[url('/images/roamance-logo-no-text.png')] bg-repeat-space bg-contain mix-blend-overlay";
    const baseBadge = 'text-white border shadow-sm';

    // Determine styles based on journal type and favorite status
    if (journal.is_favorite) {
      return {
        gradient: `${baseGradient} from-amber-500/90 via-orange-500/90 to-yellow-500/90`,
        pattern: `${basePattern} opacity-10`,
        badge: `${baseBadge} bg-amber-500 border-amber-400/20`,
        accentColor: 'text-amber-500',
        accentHoverBg: 'hover:bg-amber-50 dark:hover:bg-amber-900/10',
        accentBorder: 'border-amber-200 dark:border-amber-800/40',
        starBg: 'bg-amber-500/85 hover:bg-amber-500 border-amber-400/30',
        shimmerColor: 'via-white/20',
      };
    }

    switch (colorScheme.type) {
      case 'ocean':
        return {
          gradient: `${baseGradient} from-blue-500/90 via-cyan-500/90 to-sky-500/90`,
          pattern: `${basePattern} opacity-15`,
          badge: `${baseBadge} bg-blue-500 border-blue-400/20`,
          accentColor: 'text-blue-500',
          accentHoverBg: 'hover:bg-blue-50 dark:hover:bg-blue-900/10',
          accentBorder: 'border-blue-200 dark:border-blue-800/40',
          starBg: 'bg-white/15 hover:bg-white/30 border-white/20',
          shimmerColor: 'via-white/20',
        };
      case 'sunset':
        return {
          gradient: `${baseGradient} from-rose-500/90 via-pink-500/90 to-orange-500/90`,
          pattern: `${basePattern} opacity-10`,
          badge: `${baseBadge} bg-rose-500 border-rose-400/20`,
          accentColor: 'text-rose-500',
          accentHoverBg: 'hover:bg-rose-50 dark:hover:bg-rose-900/10',
          accentBorder: 'border-rose-200 dark:border-rose-800/40',
          starBg: 'bg-white/15 hover:bg-white/30 border-white/20',
          shimmerColor: 'via-white/15',
        };
      case 'forest':
        return {
          gradient: `${baseGradient} from-emerald-500/90 via-green-500/90 to-teal-500/90`,
          pattern: `${basePattern} opacity-15`,
          badge: `${baseBadge} bg-emerald-500 border-emerald-400/20`,
          accentColor: 'text-emerald-500',
          accentHoverBg: 'hover:bg-emerald-50 dark:hover:bg-emerald-900/10',
          accentBorder: 'border-emerald-200 dark:border-emerald-800/40',
          starBg: 'bg-white/15 hover:bg-white/30 border-white/20',
          shimmerColor: 'via-white/20',
        };
      case 'violet':
        return {
          gradient: `${baseGradient} from-violet-500/90 via-purple-500/90 to-indigo-500/90`,
          pattern: `${basePattern} opacity-10`,
          badge: `${baseBadge} bg-violet-500 border-violet-400/20`,
          accentColor: 'text-violet-500',
          accentHoverBg: 'hover:bg-violet-50 dark:hover:bg-violet-900/10',
          accentBorder: 'border-violet-200 dark:border-violet-800/40',
          starBg: 'bg-white/15 hover:bg-white/30 border-white/20',
          shimmerColor: 'via-white/15',
        };
      case 'lavender':
        return {
          gradient: `${baseGradient} from-indigo-400/90 via-purple-400/90 to-fuchsia-400/90`,
          pattern: `${basePattern} opacity-15`,
          badge: `${baseBadge} bg-indigo-500 border-indigo-400/20`,
          accentColor: 'text-indigo-500',
          accentHoverBg: 'hover:bg-indigo-50 dark:hover:bg-indigo-900/10',
          accentBorder: 'border-indigo-200 dark:border-indigo-800/40',
          starBg: 'bg-white/15 hover:bg-white/30 border-white/20',
          shimmerColor: 'via-white/15',
        };
      default:
        return {
          gradient: `${baseGradient} from-indigo-500/90 via-purple-500/90 to-indigo-400/90`,
          pattern: `${basePattern} opacity-15`,
          badge: `${baseBadge} bg-indigo-500 border-indigo-400/20`,
          accentColor: 'text-indigo-500',
          accentHoverBg: 'hover:bg-indigo-50 dark:hover:bg-indigo-900/10',
          accentBorder: 'border-indigo-200 dark:border-indigo-800/40',
          starBg: 'bg-white/15 hover:bg-white/30 border-white/20',
          shimmerColor: 'via-white/15',
        };
    }
  };

  const styles = getCardStyles();

  // Card animations
  const cardVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: "0 20px 40px -20px rgba(0, 0, 0, 0.15)",
      transition: { type: "spring", stiffness: 300, damping: 15 }
    }
  };

  // Button animations
  const buttonVariants = {
    hover: {
      scale: 1.08,
      transition: { type: "spring", stiffness: 400, damping: 15 }
    },
    tap: {
      scale: 0.92
    }
  };

  // Shimmer delay based on journal ID for staggered effect
  const getShimmerDelay = () => {
    // Create a hash from the journal id
    const hash = journal.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return `${hash % 5}s`; // 0-4 second delay
  };

  return (
    <motion.div
      whileHover="hover"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card
        variants={cardVariants}
        className="overflow-hidden group h-full flex flex-col border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all duration-300 rounded-xl"
        onClick={() => onView(journal)}
      >
        {/* Journal Header Image */}
        <div className="h-52 relative overflow-hidden flex-shrink-0">
          {journal.cover_image ? (
            <div className="h-full w-full relative">
              <Image
                src={journal.cover_image}
                alt={journal.title}
                fill
                className="object-cover transition-transform duration-700 ease-in-out will-change-transform group-hover:scale-110"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500"></div>
            </div>
          ) : (
            <div className={cn('absolute inset-0 flex items-center justify-center', styles.gradient)}>
              {/* Decorative pattern overlay */}
              <div className={cn("absolute inset-0", styles.pattern)} />

              {/* Enhanced shimmer effect */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  className={cn(
                    "absolute -inset-x-full top-0 bottom-0 bg-gradient-to-r from-transparent",
                    styles.shimmerColor,
                    "to-transparent animate-[shimmer_3s_infinite]"
                  )}
                  style={{
                    transform: 'translateX(-10%) skewX(-15deg)',
                    animationDelay: getShimmerDelay(),
                    animationDuration: '3s'
                  }}
                />
              </div>
            </div>
          )}

          {/* Title overlay for cover images */}
          {journal.cover_image && (
            <div className="absolute inset-x-0 bottom-0 p-4 z-10">
              <h3 className="text-white text-xl font-bold drop-shadow-md leading-tight line-clamp-2 tracking-tight">
                {journal.title}
              </h3>
            </div>
          )}

          {/* Centered title for gradient backgrounds */}
          {!journal.cover_image && (
            <div className="relative z-10 text-center px-6 h-full flex items-center justify-center">
              <p className="text-white text-2xl font-bold drop-shadow-md leading-tight tracking-tight">
                {journal.title}
              </p>
            </div>
          )}

          {/* Top badges row */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-20">
            <Badge
              className={cn(
                'capitalize rounded-full px-3 py-1 font-medium backdrop-blur-sm',
                styles.badge
              )}
            >
              {journal.total_subsections}{' '}
              {journal.total_subsections === 1 ? 'section' : 'sections'}
            </Badge>

            {/* Shared/Private badge */}
            <Badge
              className={cn(
                'flex items-center gap-1.5 font-medium rounded-full px-3 py-1 backdrop-blur-sm',
                journal.is_shared
                  ? 'bg-sky-500/90 text-white border border-sky-400/30'
                  : 'bg-slate-700/90 text-white border border-slate-600/30'
              )}
            >
              {journal.is_shared ? (
                <Share2 className="h-3.5 w-3.5" />
              ) : (
                <Lock className="h-3.5 w-3.5" />
              )}
              {journal.is_shared ? 'Shared' : 'Private'}
            </Badge>
          </div>

          {/* Bottom badges row */}
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center z-20">
            {/* Date badge */}
            <Badge
              variant="outline"
              className="bg-black/50 text-white border-white/30 flex items-center gap-1.5 rounded-full backdrop-blur-sm px-3 py-1"
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">
                {formatDate(journal.audit.created_at)}
              </span>
            </Badge>

            {/* Favorite button */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    variants={buttonVariants}
                    whileTap="tap"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(journal);
                    }}
                    className={cn(
                      'h-9 w-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 shadow-md',
                      styles.starBg,
                      journal.is_favorite ? 'text-white' : 'text-white'
                    )}
                  >
                    <Star
                      className={cn('h-4 w-4', journal.is_favorite ? 'fill-white' : '')}
                    />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{journal.is_favorite ? 'Remove from favorites' : 'Add to favorites'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Archived indicator if applicable */}
          {journal.is_archived && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-30">
              <div className="bg-white/90 dark:bg-slate-800/90 rounded-lg py-2 px-4 shadow-lg backdrop-blur-sm border border-slate-200 dark:border-slate-700 transform rotate-[-5deg]">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <Archive className="h-4 w-4" />
                  <span className="font-medium">Archived</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Journal Content */}
        <div className="p-5 flex-1 flex flex-col">
          {!journal.cover_image && (
            <div>
              <h3
                className={cn(
                  'font-semibold text-lg mb-1.5 transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400',
                  styles.accentColor
                )}
              >
                {journal.title}
              </h3>
              {journal.destination && (
                <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="truncate max-w-[180px]">
                    {journal.destination
                      ? `${journal.destination.latitude.toFixed(2)}, ${journal.destination.longitude.toFixed(2)}`
                      : 'No location'}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Description with elegant empty state */}
          {journal.description ? (
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-3.5 line-clamp-3 leading-relaxed flex-1">
              {journal.description}
            </p>
          ) : (
            <div className="flex items-center justify-center flex-1 mt-3.5 py-4 rounded-lg border border-dashed border-slate-200 dark:border-slate-800/70 bg-slate-50/50 dark:bg-slate-900/50">
              <p className="text-slate-400 dark:text-slate-500 text-sm italic">
                No description provided for this journal
              </p>
            </div>
          )}

          {/* Time indicator and actions */}
          <div className="mt-5 pt-4 border-t border-slate-200/70 dark:border-slate-800/70 flex justify-between items-center">
            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {formatRelativeTime(new Date(journal.audit.created_at))}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-1.5">
              <motion.button
                variants={buttonVariants}
                whileTap="tap"
                onClick={(e) => {
                  e.stopPropagation();
                  onView(journal);
                }}
                className={cn(
                  "flex items-center justify-center h-8 w-8 rounded-full text-slate-500 dark:text-slate-400 transition-colors duration-200",
                  "hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:text-indigo-600 dark:hover:text-indigo-400"
                )}
              >
                <BookOpen className="h-4 w-4" />
              </motion.button>

              <motion.button
                variants={buttonVariants}
                whileTap="tap"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(journal);
                }}
                className={cn(
                  "flex items-center justify-center h-8 w-8 rounded-full text-slate-500 dark:text-slate-400 transition-colors duration-200",
                  "hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600 dark:hover:text-blue-400"
                )}
              >
                <Edit className="h-4 w-4" />
              </motion.button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    variants={buttonVariants}
                    whileTap="tap"
                    onClick={(e) => e.stopPropagation()}
                    className={cn(
                      "flex items-center justify-center h-8 w-8 rounded-full text-slate-500 dark:text-slate-400 transition-colors duration-200",
                      "hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300"
                    )}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(journal);
                    }}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <BookOpen className="h-4 w-4 text-indigo-500" />
                    <span>Open Journal</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(journal);
                    }}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4 text-blue-500" />
                    <span>Edit Journal</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(journal);
                    }}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <Star
                      className={cn("h-4 w-4",
                        journal.is_favorite ? "text-amber-500 fill-amber-500" : "text-slate-500"
                      )}
                    />
                    <span>
                      {journal.is_favorite ? "Remove from Favorites" : "Add to Favorites"}
                    </span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleArchive(journal);
                    }}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    {journal.is_archived ? (
                      <>
                        <ArchiveRestore className="h-4 w-4 text-indigo-500" />
                        <span>Unarchive Journal</span>
                      </>
                    ) : (
                      <>
                        <Archive className="h-4 w-4 text-violet-500" />
                        <span>Archive Journal</span>
                      </>
                    )}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(journal);
                    }}
                    className="cursor-pointer flex items-center gap-2 text-rose-500 focus:text-rose-500"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Journal</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Stats indicator if needed */}
          {(journal.total_subsections > 0 || journal.subsection_types?.length > 0) && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/50 flex gap-2 flex-wrap">
              {journal.subsection_types?.map((type, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="rounded-full px-2 py-0.5 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                >
                  {type === 'LOCATION' && <MapPin className="h-3 w-3" />}
                  {type === 'ACTIVITY' && <ImageIcon className="h-3 w-3" />}
                  {type === 'ROUTE' && <Route className="h-3 w-3" />}
                  {type === 'MAP' && <MapPin className="h-3 w-3" />}
                  {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
