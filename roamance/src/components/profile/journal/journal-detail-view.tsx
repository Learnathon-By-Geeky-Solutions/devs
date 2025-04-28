import { getImagePath } from '@/components';
import { LocationMap } from '@/components/maps/LocationViwer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { CloudinaryUploadResult } from '@/service/cloudinary-service';
import { journalService } from '@/service/journal-service';
import { subsectionService } from '@/service/subsection-service';
import { JournalCreateRequest, JournalDetail } from '@/types/journal';
import {
  SubsectionDetailResponseDto,
  SubsectionRequest,
  SubsectionType,
} from '@/types/subsection';
import { formatRelativeTime } from '@/utils/format';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  ChevronDown,
  Edit2,
  Eye,
  Loader2,
  Map,
  MapPin,
  PlusCircle,
  Save,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { DialogXButton } from '../../common/button/dialog-x-button';
import { ConfirmDialog } from '../../common/confirm-dialog';
import { JournalMetadataForm } from './journal-metadata-form';
import { JournalSkeleton } from './journal-skeleton';
import { SubsectionDetail } from './subsection-detail';
import { SubsectionForm } from './subsection-form';
import { SubsectionList } from './subsection-list';

interface JournalDetailViewProps {
  journal: JournalDetail | null; // Made optional to handle loading state
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean; // Added loading state prop
}

export const JournalDetailView: React.FC<JournalDetailViewProps> = ({
  journal,
  isOpen,
  onClose,
  isLoading = false, // Default to false
}) => {
  const [activeSubsection, setActiveSubsection] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [subsectionFormVisible, setSubsectionFormVisible] = useState(false);
  const [isSubmittingSubsection, setIsSubmittingSubsection] = useState(false);
  const [deleteSubsectionDialogOpen, setDeleteSubsectionDialogOpen] =
    useState(false);
  const [subsectionToDelete, setSubsectionToDelete] = useState<number>(-1);
  const [subsectionDetails, setSubsectionDetails] = useState<{
    [key: string]: SubsectionDetailResponseDto;
  }>({});
  const [isLoadingSubsection, setIsLoadingSubsection] = useState<{
    [key: string]: boolean;
  }>({});
  // Add delete journal confirmation state
  const [isDeleteJournalDialogOpen, setIsDeleteJournalDialogOpen] =
    useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Function to fetch subsection details
  const fetchSubsectionDetails = useCallback(
    async (subsectionId: string) => {
      if (subsectionDetails[subsectionId]) {
        // Already loaded
        return;
      }

      // Set loading state for this subsection
      setIsLoadingSubsection((prev) => ({ ...prev, [subsectionId]: true }));

      try {
        const response =
          await subsectionService.getSubsectionById(subsectionId);
        if (response && response.data) {
          // Add the fetched subsection to our cache
          setSubsectionDetails((prev) => ({
            ...prev,
            [subsectionId]: response.data,
          }));
        }
      } catch (error) {
        console.error(
          `Failed to fetch subsection details for ID ${subsectionId}:`,
          error
        );
        // Don't show error toast for background loading
        // Only show errors when explicitly trying to view a subsection
      } finally {
        setIsLoadingSubsection((prev) => ({ ...prev, [subsectionId]: false }));
      }
    },
    [subsectionDetails]
  );

  // For editing the journal
  const [editableJournal, setEditableJournal] = useState<JournalCreateRequest>({
    title: '',
    description: '',
    destination: { latitude: 0, longitude: 0 },
    subsections: [],
    is_favorite: false,
    is_archived: false,
    is_shared: false,
    date: new Date().toISOString().split('T')[0],
    cover_image: '',
  });

  // Update editable journal when journal changes
  useEffect(() => {
    if (journal) {
      setEditableJournal({
        title: journal.title,
        description: journal.description,
        destination: journal.destination,
        subsections: journal.subsections.map((sub) => ({
          ...sub,
          journal_id: journal.id,
        })),
        is_favorite: journal.is_favorite,
        is_archived: journal.is_archived,
        is_shared: journal.is_shared,
        date: journal.date || new Date().toISOString().split('T')[0],
        cover_image: journal.cover_image || '',
      });
    }
  }, [journal]);

  // Reset active subsection on journal change (collapse all) and background load of all subsections
  useEffect(() => {
    if (journal?.subsections) {
      journal.subsections.forEach((subsection) => {
        fetchSubsectionDetails(subsection.id);
      });
    }
    setActiveSubsection(null);
  }, [journal?.id, fetchSubsectionDetails, journal?.subsections]);

  // Reset edit mode when the dialog is opened/closed
  useEffect(() => {
    if (!isOpen) {
      setEditMode(false);
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Special handling for checkbox fields
    if (
      name === 'is_favorite' ||
      name === 'is_archived' ||
      name === 'is_shared'
    ) {
      setEditableJournal((prev) => ({
        ...prev,
        [name]:
          e.target.type === 'checkbox'
            ? (e.target as HTMLInputElement).checked
            : value === 'true',
      }));
    } else {
      setEditableJournal((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);

    setEditableJournal((prev) => ({
      ...prev,
      destination: {
        ...prev.destination,
        [name === 'latitude' ? 'latitude' : 'longitude']: isNaN(numValue)
          ? 0
          : numValue,
      },
    }));
  };

  const handleCoverImageUpload = (result: CloudinaryUploadResult) => {
    // Update the form data with the uploaded image URL
    setEditableJournal((prev) => ({
      ...prev,
      cover_image: result.url,
    }));
  };

  const handleAddSubsection = (subsection: SubsectionRequest) => {
    setIsSubmittingSubsection(true);

    try {
      // Add to form data
      setEditableJournal((prev) => ({
        ...prev,
        subsections: [...prev.subsections, subsection],
      }));

      setSubsectionFormVisible(false);
    } catch (error) {
      console.error('Error adding subsection:', error);
    } finally {
      setIsSubmittingSubsection(false);
    }
  };

  const confirmDeleteSubsection = () => {
    if (subsectionToDelete >= 0) {
      setEditableJournal((prev) => {
        const updatedSubsections = [...prev.subsections];
        updatedSubsections.splice(subsectionToDelete, 1);

        return {
          ...prev,
          subsections: updatedSubsections,
        };
      });

      setDeleteSubsectionDialogOpen(false);
      setSubsectionToDelete(-1);
    }
  };

  const handleRemoveSubsection = (index: number) => {
    setSubsectionToDelete(index);
    setDeleteSubsectionDialogOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!journal) return;

    setIsSaving(true);
    setEditError(null);

    try {
      // Update the journal
      await journalService.updateJournal(journal.id, editableJournal);

      setEditMode(false);
      toast.success('Journal updated successfully');

      // Refresh the journal data (ideally this would update through a callback to the parent)
      // In a real app, we would probably use a state management solution like Redux
      // For now, just close and let the parent refresh
      onClose();
    } catch (err: unknown) {
      console.error('Error updating journal:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred';
      setEditError(
        errorMessage || 'Failed to update journal. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSubsection = (id: string) => {
    setActiveSubsection((currentId) => (currentId === id ? null : id));
  };

  if (!isOpen) return null;

  // Show loading UI while journal data is being fetched
  if (isLoading || !journal) {
    return <JournalSkeleton isOpen={isOpen} onClose={onClose} />;
  }

  // Extract destination name, travel dates, and cover image from description (if available)
  let destinationName = '';
  let travelDates = '';
  let coverImage = editableJournal.cover_image;

  const descriptionLines = journal.description.split('\n');
  for (const line of descriptionLines) {
    if (line.startsWith('Destination:')) {
      destinationName = line.replace('Destination:', '').trim();
    } else if (line.startsWith('Travel Dates:')) {
      travelDates = line.replace('Travel Dates:', '').trim();
    } else if (line.startsWith('Cover Image:') && !coverImage) {
      coverImage = line.replace('Cover Image:', '').trim();
    }
  }

  // Clean description (remove metadata lines)
  const cleanDescription = descriptionLines
    .filter(
      (line) =>
        !line.startsWith('Destination:') &&
        !line.startsWith('Travel Dates:') &&
        !line.startsWith('Cover Image:')
    )
    .join('\n');

  const getTypeColors = (type: SubsectionType) => {
    switch (type) {
      case SubsectionType.SIGHTSEEING:
        return {
          bg: 'bg-indigo-50 dark:bg-indigo-900/20',
          icon: 'text-indigo-500 dark:text-indigo-400',
          border: 'border-indigo-200 dark:border-indigo-800/50',
          badge:
            'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
          bgSolid: 'bg-indigo-500 dark:bg-indigo-600',
          gradient: 'from-indigo-500 via-purple-500 to-violet-500',
        };
      case SubsectionType.ACTIVITY:
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          icon: 'text-amber-500 dark:text-amber-400',
          border: 'border-amber-200 dark:border-amber-800/50',
          badge:
            'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
          bgSolid: 'bg-amber-500 dark:bg-amber-600',
          gradient: 'from-amber-500 via-orange-500 to-yellow-500',
        };
      case SubsectionType.ROUTE:
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-900/20',
          icon: 'text-emerald-500 dark:text-emerald-400',
          border: 'border-emerald-200 dark:border-emerald-800/50',
          badge:
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
          bgSolid: 'bg-emerald-500 dark:bg-emerald-600',
          gradient: 'from-emerald-500 via-green-500 to-teal-500',
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-800',
          icon: 'text-gray-500 dark:text-gray-400',
          border: 'border-gray-200 dark:border-gray-700',
          badge:
            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
          bgSolid: 'bg-gray-500 dark:bg-gray-600',
          gradient: 'from-gray-500 via-gray-600 to-gray-700',
        };
    }
  };

  // Get the count of subsections
  const subsectionCount = journal.subsections?.length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-4xl sm:max-w-4xl max-h-[90vh] overflow-hidden p-0 rounded-xl border border-muted/30 shadow-xl">
        <DialogTitle className="sr-only">
          {journal?.title || 'Journal Details'}
        </DialogTitle>
        {/* Journal Header with Cover Image */}
        <div className="relative">
          {coverImage ? (
            <div
              className="relative h-32 md:h-40 lg:h-52 overflow-hidden bg-center bg-cover"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${
                  coverImage || `${getImagePath('roamance-logo-no-text.png')}`
                })`,
              }}
            >
              {/* Journal title and location */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="space-y-2"
                >
                  <Badge className="bg-white/20 text-white backdrop-blur-sm border-none px-3 py-1">
                    {subsectionCount}{' '}
                    {subsectionCount === 1 ? 'Section' : 'Sections'}
                  </Badge>

                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight tracking-tight drop-shadow-sm">
                    {journal.title}
                  </h2>

                  <div className="flex flex-wrap gap-4 mt-2">
                    {destinationName && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="flex items-center text-white/90"
                      >
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mr-2">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <span className="text-sm">{destinationName}</span>
                      </motion.div>
                    )}

                    {travelDates && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="flex items-center text-white/90"
                      >
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mr-2">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <span className="text-sm">{travelDates}</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600 p-8 relative">
              {/* Decorative elements */}
              <div className="absolute -left-20 -top-20 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl"></div>
              <div className="absolute -right-20 -bottom-10 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl"></div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="space-y-4"
              >
                <Badge className="bg-white/20 text-white backdrop-blur-sm border-none px-3 py-1">
                  {subsectionCount}{' '}
                  {subsectionCount === 1 ? 'Section' : 'Sections'}
                </Badge>

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight tracking-tight">
                  {journal.title}
                </h2>

                <div className="flex flex-wrap gap-4 mt-2">
                  {destinationName && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="flex items-center text-white/90"
                    >
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mr-2">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="text-sm">{destinationName}</span>
                    </motion.div>
                  )}

                  {travelDates && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="flex items-center text-white/90"
                    >
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mr-2">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <span className="text-sm">{travelDates}</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* Body content with scroll */}
        <div className="flex-1 overflow-y-auto max-h-[calc(90vh-300px)]">
          <div className="px-6 md:px-8 py-6">
            {/* Error banner if there's an error during editing */}
            {editError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-lg bg-destructive/10 border border-destructive/20 p-4"
              >
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-destructive">
                      {editError}
                    </p>
                  </div>
                  <button
                    onClick={() => setEditError(null)}
                    className="ml-auto flex-shrink-0 p-1.5 text-muted-foreground hover:text-foreground"
                  >
                    <span className="sr-only">Dismiss</span>
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Edit or View Content */}
            {editMode ? (
              <div className="space-y-6">
                {/* Journal Metadata Form for editing */}
                <div className="relative mb-6">
                  <div className="absolute left-0 top-1/2 w-1 h-6 bg-indigo-500 rounded-r-full transform -translate-y-1/2"></div>
                  <h3 className="text-lg font-medium pl-3 text-foreground">
                    Journal Details
                  </h3>
                </div>

                <div className="bg-muted/5 rounded-xl border border-muted/20 p-6 shadow-sm">
                  <JournalMetadataForm
                    formData={editableJournal}
                    onChange={handleChange}
                    onLocationChange={handleLocationChange}
                    onCoverImageUpload={handleCoverImageUpload}
                  />
                </div>

                {/* Sections header with decorative element */}
                <div className="relative mb-6 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="absolute left-0 top-1/2 w-1 h-6 bg-purple-500 rounded-r-full transform -translate-y-1/2"></div>
                    <h3 className="text-lg font-medium pl-3 text-foreground">
                      Journal Sections
                    </h3>
                  </div>

                  <Button
                    type="button"
                    onClick={() => setSubsectionFormVisible(true)}
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-sm hover:shadow-md transition-all duration-200 gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add Section
                  </Button>
                </div>

                {/* Sections list with improved styling */}
                <div className="bg-muted/5 rounded-xl border border-muted/20 p-2 shadow-sm mb-6 min-h-[150px]">
                  <SubsectionList
                    subsections={editableJournal.subsections}
                    onRemoveSubsection={handleRemoveSubsection}
                    onAddSubsectionClick={() => setSubsectionFormVisible(true)}
                    onReorderSubsections={
                      editMode
                        ? (startIndex, endIndex) => {
                            const newSubsections = [
                              ...editableJournal.subsections,
                            ];
                            const [moved] = newSubsections.splice(
                              startIndex,
                              1
                            );
                            newSubsections.splice(endIndex, 0, moved);
                            setEditableJournal((prev) => ({
                              ...prev,
                              subsections: newSubsections,
                            }));
                          }
                        : undefined
                    }
                    onSelectSubsection={
                      editMode
                        ? (subsectionId) => {
                            // Handle subsection selection in edit mode
                            setActiveSubsection(subsectionId);
                          }
                        : undefined
                    }
                    selectedSubsectionId={activeSubsection}
                    editMode={editMode}
                  />
                </div>
              </div>
            ) : (
              <>
                {/* Journal description - View mode */}
                {cleanDescription && (
                  <div className="mb-6">
                    <div className="py-5 px-6 rounded-xl bg-muted/20 border border-muted/30 backdrop-blur-sm prose prose-sm dark:prose-invert max-w-none">
                      <p className="text-foreground/90">{cleanDescription}</p>
                    </div>
                  </div>
                )}

                {/* Journal metadata */}
                <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/20">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-800/30 flex items-center justify-center mr-3 flex-shrink-0">
                      <Map className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-xs text-indigo-500 dark:text-indigo-400 font-medium uppercase tracking-wider mb-1">
                        Location
                      </div>
                      <div className="text-sm text-foreground">
                        {journal.destination
                          ? `${journal.destination.latitude.toFixed(4)}, ${journal.destination.longitude.toFixed(4)}`
                          : 'No location data'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center p-4 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/20">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-800/30 flex items-center justify-center mr-3 flex-shrink-0">
                      <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="text-xs text-purple-500 dark:text-purple-400 font-medium uppercase tracking-wider mb-1">
                        Created
                      </div>
                      <div className="text-sm text-foreground">
                        {formatRelativeTime(new Date(journal.audit.created_at))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Map Toggle */}
                {journal.destination && (
                  <div className="mb-8">
                    <Button
                      onClick={() => setShowMap(!showMap)}
                      variant="outline"
                      className={cn(
                        'w-full justify-between group p-4 h-auto border-muted/50 hover:border-indigo-400/50',
                        showMap &&
                          'border-indigo-400/50 bg-indigo-50/50 dark:bg-indigo-900/10'
                      )}
                    >
                      <span className="flex items-center text-foreground">
                        <Map className="w-5 h-5 mr-2 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" />
                        <span className="font-medium">
                          {showMap ? 'Hide Map Location' : 'Show Map Location'}
                        </span>
                      </span>
                      <div
                        className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300',
                          showMap
                            ? 'bg-indigo-100 dark:bg-indigo-900/30 rotate-180'
                            : 'bg-muted/50'
                        )}
                      >
                        <ChevronDown className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </Button>

                    {showMap && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 rounded-xl overflow-hidden border border-muted">
                          <LocationMap
                            location={journal.destination}
                            type="single"
                            height="270px"
                            className="w-full"
                            zoom={12}
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Journal Sections */}
                <div>
                  <div className="flex items-center mb-6">
                    <div className="relative mr-3">
                      <div className="absolute left-0 top-1/2 w-1 h-6 bg-purple-500 rounded-r-full transform -translate-y-1/2"></div>
                      <h3 className="text-xl font-semibold text-foreground pl-3">
                        Journal Sections
                      </h3>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/30"
                    >
                      {subsectionCount}{' '}
                      {subsectionCount === 1 ? 'Section' : 'Sections'}
                    </Badge>
                  </div>

                  {journal.subsections && journal?.subsections?.length > 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-4"
                    >
                      {journal.subsections.map((subsection, index) => {
                        const isActive = activeSubsection === subsection.id;
                        const colors = getTypeColors(subsection.type);

                        return (
                          <SubsectionDetail
                            key={subsection.id}
                            subsection={subsection}
                            isActive={isActive}
                            toggleSubsection={() =>
                              toggleSubsection(subsection.id)
                            }
                            colors={colors}
                            index={index}
                          />
                        );
                      })}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl bg-muted/10 border border-dashed border-muted/50 p-8 text-center"
                    >
                      <div className="relative w-16 h-16 mx-auto mb-4">
                        <div className="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/20 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-200 dark:border-indigo-800/50 animate-spin-slow"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Eye className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
                        </div>
                      </div>
                      <h4 className="text-lg font-medium text-foreground mb-2">
                        No sections yet
                      </h4>
                      <p className="text-muted-foreground max-w-md mx-auto mb-4">
                        This journal doesn&apos;t have any sections added to it
                        yet.
                      </p>
                      {editMode && (
                        <Button
                          onClick={() => setSubsectionFormVisible(true)}
                          variant="outline"
                          className="bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/20"
                        >
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Add a section
                        </Button>
                      )}
                    </motion.div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer with buttons */}
        <div className="p-4 px-6 md:px-8 border-t border-muted/30 bg-muted/5 backdrop-blur-sm sticky bottom-0 flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Journals
            </Button>

            {/* Delete Button */}
            <Button
              onClick={() => setIsDeleteJournalDialogOpen(true)}
              variant="outline"
              className="gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/10 border-rose-200 dark:border-rose-800/30 transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
              Delete Journal
            </Button>
          </div>

          {/* Edit/Save Button */}
          {editMode ? (
            <Button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className={cn(
                'gap-2 min-w-[140px] relative overflow-hidden',
                'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700',
                'text-white shadow-md hover:shadow-lg transition-all duration-300'
              )}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      repeatDelay: 1,
                    }}
                    className="absolute -top-1 -right-1"
                  >
                    <Sparkles className="w-4 h-4 text-white/80" />
                  </motion.div>
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={() => setEditMode(true)}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Edit2 className="w-4 h-4" />
              Edit Journal
            </Button>
          )}
        </div>
      </DialogContent>

      {/* Subsection Form Modal */}
      <AnimatePresence>
        {subsectionFormVisible && (
          <Dialog
            open={subsectionFormVisible}
            onOpenChange={setSubsectionFormVisible}
          >
            <DialogContent className="w-full max-w-4xl sm:max-w-4xl h-full max-h-[85vh] overflow-hidden p-0 rounded-xl border border-muted/30 shadow-xl">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-cyan-600/10 z-0"></div>
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
                <div className="absolute -left-20 -top-20 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl"></div>

                <div className="relative p-6 pb-4 border-b border-muted/20 bg-background/80 backdrop-blur-md z-10 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-semibold text-foreground m-0 p-0">
                      Add New Journal Section
                    </DialogTitle>
                    <p className="text-muted-foreground text-sm mt-0.5">
                      Document a specific part of your journey
                    </p>
                  </div>
                  <DialogXButton
                    onClick={() => setSubsectionFormVisible(false)}
                    className="ml-auto"
                  />
                </div>
              </div>

              <div className="max-h-[calc(70vh-140px)] overflow-y-auto">
                <div className="p-6">
                  <SubsectionForm
                    isSubmitting={isSubmittingSubsection}
                    onAddSubsection={handleAddSubsection}
                    onCancel={() => setSubsectionFormVisible(false)}
                    journalId={journal?.id}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Confirm Delete Subsection Dialog */}
      <ConfirmDialog
        isOpen={deleteSubsectionDialogOpen}
        title="Delete Section"
        message="Are you sure you want to delete this section? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={false}
        onConfirm={confirmDeleteSubsection}
        onCancel={() => setDeleteSubsectionDialogOpen(false)}
      />

      {/* Confirm Delete Journal Dialog */}
      <ConfirmDialog
        isOpen={isDeleteJournalDialogOpen}
        title="Delete Journal"
        message={`Are you sure you want to delete "${journal.title}"? This action cannot be undone and will remove all sections and data associated with this journal.`}
        confirmLabel="Delete Journal"
        cancelLabel="Cancel"
        isLoading={isDeleting}
        onConfirm={async () => {
          if (!journal?.id) return;

          setIsDeleting(true);
          try {
            await journalService.deleteJournal(journal.id);
            toast.success('Journal deleted successfully');
            onClose(); // Close the detail view after deletion
          } catch (error) {
            console.error('Error deleting journal:', error);
            toast.error('Failed to delete journal. Please try again.');
          } finally {
            setIsDeleting(false);
            setIsDeleteJournalDialogOpen(false);
          }
        }}
        onCancel={() => setIsDeleteJournalDialogOpen(false)}
      />
    </Dialog>
  );
};
