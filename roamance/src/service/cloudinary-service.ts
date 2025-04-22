import { ENV_VARS } from '@/constants/keys';

/**
 * Interface for CloudinaryUploadResult
 */
export interface CloudinaryUploadResult {
  url: string;
  public_id: string;
  resource_type: string;
  format?: string;
  original_filename?: string;
}

/**
 * CloudinaryService provides methods for uploading and managing files on Cloudinary
 */
export class CloudinaryService {
  /**
   * Upload a file (image, video, document) to Cloudinary
   * @param file The file to upload
   * @param options Optional upload options
   * @returns Promise with upload result containing the URL and metadata
   */
  static async upload(
    file: File,
    options: { folder?: string; tags?: string[] } = {}
  ): Promise<CloudinaryUploadResult> {
    if (!file) {
      throw new Error('No file provided');
    }

    const formData = new FormData();
    formData.append('file', file);

    // Add optional parameters to form data
    if (options.folder) formData.append('folder', options.folder);
    if (options.tags) formData.append('tags', options.tags.join(','));

    const response = await fetch('/api/cloudinary/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Upload failed');
    }

    return response.json();
  }

  /**
   * Generate a Cloudinary URL with transformations for an image
   * @param publicId The public ID of the image
   * @param options Transformation options
   * @returns The transformed image URL
   */
  static getImageUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: number;
      format?: 'auto' | 'webp' | 'jpg' | 'png';
      effect?: string;
    } = {}
  ): string {
    if (!publicId) return '';

    const {
      width,
      height,
      crop = 'fill',
      quality = 'auto',
      format = 'auto',
      effect
    } = options;

    const transformations = [];

    // Add all requested transformations
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (crop) transformations.push(`c_${crop}`);
    if (quality) transformations.push(`q_${quality}`);
    if (format) transformations.push(`f_${format}`);
    if (effect) transformations.push(`e_${effect}`);

    const transformationString = transformations.length ? transformations.join(',') + '/' : '';

    return `https://res.cloudinary.com/${ENV_VARS.CLOUDINARY_CLOUD_NAME}/image/upload/${transformationString}${publicId}`;
  }

  /**
   * Generate a Cloudinary URL for a video
   * @param publicId The public ID of the video
   * @param options Video transformation options
   * @returns The video URL
   */
  static getVideoUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      quality?: string;
      format?: 'mp4' | 'webm';
    } = {}
  ): string {
    if (!publicId) return '';

    const { width, height, quality = 'auto', format = 'mp4' } = options;
    const transformations = [];

    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (quality) transformations.push(`q_${quality}`);
    if (format) transformations.push(`f_${format}`);

    const transformationString = transformations.length ? transformations.join(',') + '/' : '';

    return `https://res.cloudinary.com/${ENV_VARS.CLOUDINARY_CLOUD_NAME}/video/upload/${transformationString}${publicId}`;
  }

  /**
   * Delete a file from Cloudinary
   * @param publicId The public ID of the file to delete
   * @returns Promise with the deletion result
   */
  static async deleteFile(publicId: string): Promise<boolean> {
    try {
      const response = await fetch('/api/cloudinary/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      return true;
    } catch (error) {
      console.error('Error deleting file from Cloudinary:', error);
      return false;
    }
  }
}
