export interface TouristPlace {
  id: string;
  name: string;
  lat: number;
  lng: number;
  country: string;
  description: string;
  color: string;
  size: number;
  image?: string;
  images?: string[];
}

export interface Geoname {
  name: string;
  toponymName: string;
  lat: string;
  lng: string;
  geonameId: number;
  countryName: string;
  countryCode: string;
  countryId: string;
  adminCode1: string;
  adminName1: string;
  adminCodes1?: {
    ISO3166_2: string;
  };
  fcl: string;
  fclName: string;
  fcode: string;
  fcodeName: string;
  population: number;
  timezone?: {
    timeZoneId: string;
    dstOffset: number;
    gmtOffset: number;
  };
  bbox?: {
    east: number;
    south: number;
    north: number;
    west: number;
  };
  wikipediaURL?: string;
  thumbnailImg?: string;
}

export interface GeoNamesResult {
  geonames: Geoname[];
  totalResultsCount?: number;
  status?: {
    message: string;
    value: number;
  };
}

export interface CacheItem<T> {
  data: T;
  timestamp: number;
}
