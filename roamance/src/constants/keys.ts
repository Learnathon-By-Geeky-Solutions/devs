export const COOKIE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;

export const ENV_VARS = {
  // API URL configuration
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  // Unsplash configuration
  UNSPLASH_ACCESS_KEY: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '',
  // Geonames configuration
  GEONAMES_USERNAME: process.env.NEXT_PUBLIC_GEONAMES_USERNAME || 'demo',
  // Cloudinary configuration
  CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET || '',
  CLOUDINARY_UPLOAD_PRESET:
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'roamance',
} as const;
