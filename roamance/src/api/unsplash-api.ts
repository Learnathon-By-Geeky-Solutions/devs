import { createApi } from 'unsplash-js';
import { ApiError } from './errors';
import { ApiResponse } from '@/types';
import { ENV_VARS } from '@/constants/keys';
import axios, { AxiosError } from 'axios';

const UNSPLASH_ACCESS_KEY = ENV_VARS.UNSPLASH_ACCESS_KEY;

const unsplashApi = createApi({
  accessKey: UNSPLASH_ACCESS_KEY,
});

export async function fetchImages(
  query: string,
  count: number = 5
): Promise<string[]> {
  try {
    const enhancedQuery = `${query} landmark travel`;

    const result = await unsplashApi.search.getPhotos({
      query: enhancedQuery,
      perPage: count,
      orientation: 'landscape',
    });

    const photoResults = result.response?.results;
    if (photoResults && photoResults.length > 0) {
      return photoResults.map((photo) => photo.urls.regular);
    }

    console.log(`No images found for ${query} on Unsplash`);
    return [];
  } catch (error) {
    console.error(`Error fetching Unsplash images for ${query}:`, error);

    // Handle potential axios error with ApiResponse type
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorResponse = axiosError.response?.data;
      const status = errorResponse?.status || axiosError.response?.status || 500;
      const message = errorResponse?.message || `Failed to fetch images for "${query}"`;
      throw new ApiError(message, status);
    }

    throw new ApiError(`Failed to fetch images for "${query}"`, 500);
  }
}

export async function fetchImage(query: string): Promise<string | undefined> {
  try {
    const images = await fetchImages(query, 1);
    return images.length > 0 ? images[0] : undefined;
  } catch (error) {
    console.error(`Error fetching Unsplash image for ${query}:`, error);

    // Handle potential axios error with ApiResponse type
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorResponse = axiosError.response?.data;
      const status = errorResponse?.status || axiosError.response?.status || 500;
      const message = errorResponse?.message || `Failed to fetch image for "${query}"`;
      throw new ApiError(message, status);
    }

    throw new ApiError(`Failed to fetch image for "${query}"`, 500);
  }
}

export async function getRandomTravelImage(): Promise<string | undefined> {
  try {
    const result = await unsplashApi.photos.getRandom({
      query: 'travel landscape',
      count: 1,
    });

    if (result.response && Array.isArray(result.response)) {
      const photo = result.response[0];
      return photo.urls.regular;
    }

    return undefined;
  } catch (error) {
    console.error('Error fetching random travel image:', error);

    // Handle potential axios error with ApiResponse type
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorResponse = axiosError.response?.data;
      const status = errorResponse?.status || axiosError.response?.status || 500;
      const message = errorResponse?.message || 'Failed to fetch random travel image';
      throw new ApiError(message, status);
    }

    throw new ApiError('Failed to fetch random travel image', 500);
  }
}

export { unsplashApi };
