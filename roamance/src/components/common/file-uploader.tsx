import {
  CloudinaryService,
  CloudinaryUploadResult,
} from '@/service/cloudinary-service';
import Image from 'next/image';
import React, { useRef, useState } from 'react';

interface FileUploaderProps {
  onUploadSuccess?: (result: CloudinaryUploadResult) => void;
  onUploadError?: (error: Error) => void;
  acceptedFileTypes?: string;
  maxSizeMB?: number;
  buttonText?: string;
  className?: string;
  multiple?: boolean;
  showPreview?: boolean;
  onClose?: () => void; // New prop to handle dialog closure
}

/**
 * FileUploader component for handling file uploads to Cloudinary
 * Supports images, videos, and documents
 */
export const FileUploader: React.FC<FileUploaderProps> = ({
  onUploadSuccess,
  onUploadError,
  acceptedFileTypes = 'image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt',
  maxSizeMB = 10,
  buttonText = 'Select file to upload',
  className = '',
  multiple = false,
  showPreview = true,
  onClose,
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] =
    useState<CloudinaryUploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSizeBytes) {
      const errorMsg = `File size exceeds ${maxSizeMB}MB limit`;
      setError(errorMsg);
      onUploadError?.(new Error(errorMsg));
      return;
    }

    setUploading(true);
    setProgress(10); // Start progress indicator
    setError(null);

    try {
      // Simulate progress updates (since we can't get real progress from fetch API)
      const progressInterval = setInterval(() => {
        setProgress((prev) =>
          Math.min(prev + Math.floor(Math.random() * 20), 90)
        );
      }, 500);

      // Upload file to Cloudinary
      const result = await CloudinaryService.upload(file);

      clearInterval(progressInterval);
      setProgress(100);
      setUploadedFile(result);
      onUploadSuccess?.(result);
    } catch (err: unknown) {
      let errorMessage = 'Upload failed';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      setError(errorMessage);
      onUploadError?.(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // New handler for close button that calls the onClose prop
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // Determine if the uploaded file is an image
  const isImage = uploadedFile?.resource_type === 'image';
  const isVideo = uploadedFile?.resource_type === 'video';

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col gap-3">
        {/* Upload button */}
        <label
          className={`flex flex-col items-center justify-center w-full h-32 px-4 transition-colors border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
            uploading
              ? 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700'
              : 'bg-white dark:bg-gray-950 border-blue-600 dark:border-blue-500'
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-3 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">{buttonText}</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG, GIF, WebP, MP4, PDF, DOCX (Max. {maxSizeMB}MB)
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={acceptedFileTypes}
            onChange={handleFileChange}
            disabled={uploading}
            multiple={multiple}
          />
        </label>

        {/* Progress indicator */}
        {uploading && (
          <div className="w-full">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                Uploading...
              </span>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                {progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-width duration-300 ease"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-950 dark:text-red-400"
            role="alert"
          >
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 flex-shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
              </svg>
              <span>{error}</span>
              <button
                type="button"
                className="ml-auto -mx-1.5 -my-1.5 bg-red-50 dark:bg-red-950 text-red-500 rounded-lg p-1.5 hover:bg-red-100 dark:hover:bg-red-900 inline-flex items-center justify-center h-8 w-8"
                onClick={resetUpload}
                aria-label="Close"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Success preview */}
        {uploadedFile && showPreview && (
          <div className="mt-2 p-4 bg-green-50 dark:bg-green-950 border-green-500 dark:border-green-700 border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-green-800 dark:text-green-400">
                Upload successful!
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={resetUpload}
                  className="px-2 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-600"
                >
                  New Upload
                </button>
                <button
                  onClick={handleClose}
                  className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  Done
                </button>
              </div>
            </div>

            {/* Image preview */}
            {isImage && (
              <div className="mt-2">
                <Image
                  src={uploadedFile.url}
                  alt="Uploaded image"
                  className="w-full max-h-48 object-contain rounded"
                  sizes="full"
                  width={0}
                  height={0}
                />
              </div>
            )}

            {/* Video preview */}
            {isVideo && (
              <div className="mt-2">
                <video
                  src={uploadedFile.url}
                  controls
                  className="w-full max-h-48 object-contain rounded"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {/* Document or other file type */}
            {!isImage && !isVideo && (
              <div className="flex items-center mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <svg
                  className="w-8 h-8 text-gray-500 dark:text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {uploadedFile.original_filename || 'Document'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {uploadedFile.format?.toUpperCase() || 'File'} • Click to
                    open
                  </p>
                </div>
                <a
                  href={uploadedFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View
                </a>
              </div>
            )}

            {/* URL display */}
            <div className="mt-3 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono break-all">
                {uploadedFile.url}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
