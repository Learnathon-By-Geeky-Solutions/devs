import { FileUploader } from '@/components/common/file-uploader';
import { LocationPickerMap } from '@/components/maps/LocationPickerMap';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CloudinaryUploadResult } from '@/service/cloudinary-service';
import { JournalCreateRequest } from '@/types/journal';
import {
  Archive,
  Calendar,
  Globe,
  Info,
  MapPin,
  Settings2,
  Share2,
  Star,
  X
} from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

interface JournalMetadataFormProps {
  formData: JournalCreateRequest;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCoverImageUpload: (result: CloudinaryUploadResult) => void;
}

export const JournalMetadataForm: React.FC<JournalMetadataFormProps> = ({
  formData,
  onChange,
  onLocationChange,
  onCoverImageUpload,
}) => {
  const hasCoverImage = !!formData.cover_image;

  // Ensure destination exists with default values if it's undefined
  const destination = formData.destination || { latitude: 0, longitude: 0 };

  const handleLocationSelected = React.useCallback(
    (latitude: number, longitude: number) => {
      const latEvent = {
        target: {
          name: 'latitude',
          value: latitude.toString(),
        },
      } as React.ChangeEvent<HTMLInputElement>;

      const lngEvent = {
        target: {
          name: 'longitude',
          value: longitude.toString(),
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onLocationChange(latEvent);
      onLocationChange(lngEvent);
    },
    [onLocationChange]
  );
  const [isMapOpen, setIsMapOpen] = useState(true);

  return (
    <div className="space-y-8">
      {/* Title and Description Section */}
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg flex-shrink-0 mt-1">
              <Info className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="space-y-1 flex-1">
              <Label
                htmlFor="title"
                className="text-base font-medium text-slate-900 dark:text-slate-100"
              >
                Journal Title
              </Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Give your travel journal a memorable name
              </p>
            </div>
          </div>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={onChange}
            placeholder="e.g., Summer in Paris"
            className="w-full border-slate-300 dark:border-slate-700 focus-visible:ring-indigo-500 text-base"
            required
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg flex-shrink-0 mt-1">
              <Settings2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="space-y-1 flex-1">
              <Label
                htmlFor="description"
                className="text-base font-medium text-slate-900 dark:text-slate-100"
              >
                Description
              </Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Add details about your journey, destinations, and experiences
              </p>
            </div>
          </div>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={onChange}
            placeholder="Describe your travel experience, destinations visited, and any special memories..."
            className="w-full min-h-[120px] border-slate-300 dark:border-slate-700 focus-visible:ring-purple-500 text-base"
          />
        </div>
      </div>

      {/* Travel Date Section */}
      <div className="space-y-4">
        <div className="flex items-start gap-2">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg flex-shrink-0 mt-1">
            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="space-y-1 flex-1">
            <Label
              htmlFor="date"
              className="text-base font-medium text-slate-900 dark:text-slate-100"
            >
              Travel Date
            </Label>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              When did this journey take place?
            </p>
          </div>
        </div>
        <Input
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={onChange}
          className="w-full border-slate-300 dark:border-slate-700 focus-visible:ring-blue-500 text-base"
        />
      </div>

      {/* Cover Image Section */}
      <div className="space-y-4">
        <div className="flex items-start gap-2">
          <div className="space-y-1 flex-1">
            <Label className="text-base font-medium text-slate-900 dark:text-slate-100">
              Cover Image
            </Label>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Upload an image that represents your travel experience
            </p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
          {hasCoverImage ? (
            <div className="relative">
              <div className="relative h-48 w-full">
                <Image
                  src={formData.cover_image}
                  alt="Cover Preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-900 border-white/50 dark:border-slate-700/50 shadow-sm"
                  onClick={() => {
                    // Clear the cover image
                    const changeEvent = {
                      target: {
                        name: 'cover_image',
                        value: '',
                      },
                    } as React.ChangeEvent<HTMLInputElement>;
                    onChange(changeEvent);
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-8 flex flex-col items-center justify-center">
              <FileUploader
                onUploadSuccess={(res) => {
                  const result = Array.isArray(res) ? res[0] : res;
                  onCoverImageUpload(result);
                }}
                acceptedFileTypes="image/*"
                maxSizeMB={10}
                className="w-full"
                buttonText="Upload Cover Image"
              />
            </div>
          )}
        </div>
      </div>

      {/* Location Section */}
      <div className="space-y-4">
        <div className="flex items-start gap-2">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg flex-shrink-0 mt-1">
            <Globe className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="space-y-1 flex-1">
            <Label className="text-base font-medium text-slate-900 dark:text-slate-100">
              Location
            </Label>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Set the main destination of your journey
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="latitude"
              className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1"
            >
              <MapPin className="h-3.5 w-3.5" />
              Latitude
            </Label>
            <Input
              id="latitude"
              name="latitude"
              type="number"
              step="0.000001"
              value={destination.latitude}
              onChange={onLocationChange}
              className="border-slate-300 dark:border-slate-700 focus-visible:ring-emerald-500"
              placeholder="e.g., 48.8566"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="longitude"
              className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1"
            >
              <MapPin className="h-3.5 w-3.5" />
              Longitude
            </Label>
            <Input
              id="longitude"
              name="longitude"
              type="number"
              step="0.000001"
              value={destination.longitude}
              onChange={onLocationChange}
              className="border-slate-300 dark:border-slate-700 focus-visible:ring-emerald-500"
              placeholder="e.g., 2.3522"
            />
          </div>
        </div>

        {/* Show a mini-map preview if coordinates are set */}
        <Collapsible open={isMapOpen} onOpenChange={setIsMapOpen} className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Map Preview
            </span>
            <CollapsibleTrigger asChild/>

          </div>
          <CollapsibleContent>
            <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
              <LocationPickerMap
                initialLocation={destination}
                onLocationChangeAction={handleLocationSelected}
                height="250px"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Journal Options Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-base font-medium text-slate-900 dark:text-slate-100">
          Journal Settings
        </h3>

        <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="is_favorite"
              name="is_favorite"
              checked={formData.is_favorite}
              onCheckedChange={(checked) => {
                const changeEvent = {
                  target: {
                    type: 'checkbox',
                    name: 'is_favorite',
                    checked: checked === true,
                  },
                } as unknown as React.ChangeEvent<HTMLInputElement>;
                onChange(changeEvent);
              }}
              className="h-5 w-5 border-amber-300 dark:border-amber-700 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
            />
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              <Label
                htmlFor="is_favorite"
                className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Favorite Journal
              </Label>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox
              id="is_archived"
              name="is_archived"
              checked={formData.is_archived}
              onCheckedChange={(checked) => {
                const changeEvent = {
                  target: {
                    type: 'checkbox',
                    name: 'is_archived',
                    checked: checked === true,
                  },
                } as unknown as React.ChangeEvent<HTMLInputElement>;
                onChange(changeEvent);
              }}
              className="h-5 w-5 border-slate-300 dark:border-slate-700 data-[state=checked]:bg-slate-500 data-[state=checked]:border-slate-500"
            />
            <div className="flex items-center gap-2">
              <Archive className="h-5 w-5 text-slate-500" />
              <Label
                htmlFor="is_archived"
                className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Archive Journal
              </Label>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox
              id="is_shared"
              name="is_shared"
              checked={formData.is_shared}
              onCheckedChange={(checked) => {
                const changeEvent = {
                  target: {
                    type: 'checkbox',
                    name: 'is_shared',
                    checked: checked === true,
                  },
                } as unknown as React.ChangeEvent<HTMLInputElement>;
                onChange(changeEvent);
              }}
              className="h-5 w-5 border-blue-300 dark:border-blue-700 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
            />
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-blue-500" />
              <Label
                htmlFor="is_shared"
                className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Share Publicly
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
