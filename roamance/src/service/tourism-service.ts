import { Geoname, TouristPlace } from '@/types';
import {
  fetchPopularDestinations,
  searchGeonames,
  getGeoname,
  getFromCache,
  setCache,
  touristPlaces,
} from '@/api/places-api';
import { fetchImages } from '@/api/unsplash-api';

async function mapGeonamesToTouristPlace(
  geoname: Geoname,
  index: number
): Promise<TouristPlace> {
  const colors = [
    'var(--primary)',
    'var(--ocean)',
    'var(--forest)',
    'var(--sunset)',
  ];
  const colorIndex = geoname.countryCode
    ? geoname.countryCode.charCodeAt(0) % colors.length
    : index % colors.length;

  let description = `${geoname.name} in ${geoname.countryName || 'Unknown'}`;

  if (geoname.fcode === 'PPLC') {
    description += ' (Capital City)';
  } else if (geoname.fcode === 'ADM1') {
    description += ' (Administrative Region)';
  } else if (geoname.fcode === 'PPLA') {
    description += ' (Regional Capital)';
  }

  if (geoname.population) {
    const popMillions = geoname.population / 1000000;
    if (popMillions >= 1) {
      description += ` (Pop: ${popMillions.toFixed(1)}M)`;
    } else if (geoname.population >= 1000) {
      description += ` (Pop: ${(geoname.population / 1000).toFixed(0)}K)`;
    }
  }

  if (geoname.adminName1 && !description.includes(geoname.adminName1)) {
    description += `, ${geoname.adminName1}`;
  }

  const size = geoname.population
    ? Math.min(1.5, Math.max(0.8, Math.log10(geoname.population) / 7))
    : 1.0;

  const images = await fetchImages(geoname.name);

  return {
    id: `api-${geoname.geonameId || index}-${geoname.name.replace(/\s+/g, '-').toLowerCase()}`,
    name: geoname.toponymName || geoname.name,
    lat: parseFloat(geoname.lat),
    lng: parseFloat(geoname.lng),
    country: geoname.countryName || '',
    description,
    color: colors[colorIndex],
    size,
    image: images[0],
    images,
  };
}

export async function getInitialPlaces(): Promise<TouristPlace[]> {
  const cacheKey = 'initial_places';
  const cachedPlaces = getFromCache<TouristPlace[]>(cacheKey);
  if (cachedPlaces) {
    console.log(`Using ${cachedPlaces.length} cached places`);
    return cachedPlaces;
  }

  try {
    const popularDestinations = [
      'Paris', 'New York', 'Tokyo', 'Rome', 'Sydney',
      'Cairo', 'Rio de Janeiro', 'Barcelona', 'Istanbul', 'Dubai',
      'London', 'Venice', 'Santorini', 'Bali', 'Kyoto',
    ];

    const geonames = await fetchPopularDestinations(popularDestinations);
    const places = await Promise.all(
      geonames.map((geoname, index) =>
        mapGeonamesToTouristPlace(geoname, index)
      )
    );

    console.log(`Total places from API: ${places.length}`);

    if (places.length > 0) {
      setCache(cacheKey, places);
      return places;
    }

    console.log(`Falling back to ${touristPlaces.length} local places`);
    return touristPlaces;
  } catch (error) {
    console.error('Error fetching initial places:', error);
    console.log(
      `Falling back to ${touristPlaces.length} local places due to error`
    );
    return touristPlaces;
  }
}

export async function searchPlaces(query: string): Promise<TouristPlace[]> {
  if (!query || query.length < 2) return [];

  const cacheKey = `search_${query.toLowerCase()}`;
  const cachedResults = getFromCache<TouristPlace[]>(cacheKey);
  if (cachedResults) {
    console.log(`Using ${cachedResults.length} cached results for "${query}"`);
    return cachedResults;
  }

  const localResults = touristPlaces.filter(
    (place) =>
      place.name.toLowerCase().includes(query.toLowerCase()) ||
      place.country.toLowerCase().includes(query.toLowerCase())
  );

  try {
    const geonames = await searchGeonames(query);
    const apiResults = await Promise.all(
      geonames
        .filter((item) => item.name && item.lat && item.lng)
        .map((item, index) => mapGeonamesToTouristPlace(item, index))
    );

    console.log(
      `Found ${apiResults.length} API results and ${localResults.length} local results for "${query}"`
    );

    const combinedResults = [...apiResults];

    localResults.forEach((localPlace) => {
      const isDuplicate = combinedResults.some(
        (apiPlace) =>
          apiPlace.name.toLowerCase() === localPlace.name.toLowerCase() ||
          (apiPlace.lat === localPlace.lat && apiPlace.lng === localPlace.lng)
      );

      if (!isDuplicate) {
        combinedResults.push(localPlace);
      }
    });

    setCache(cacheKey, combinedResults);
    return combinedResults;
  } catch (error) {
    console.error(`Error searching places for "${query}":`, error);
    return localResults;
  }
}

export async function getPlaceDetails(
  placeId: string
): Promise<TouristPlace | null> {
  const apiPlaceMatch = placeId.match(/^api-(\d+)-(.+)$/);

  if (apiPlaceMatch) {
    const geonameId = apiPlaceMatch[1];
    const placeName = apiPlaceMatch[2].replace(/-/g, ' ');

    try {
      const cacheKey = `place_${geonameId}`;
      const cachedPlace = getFromCache<TouristPlace>(cacheKey);
      if (cachedPlace) return cachedPlace;

      const geoname = await getGeoname(placeName);
      if (geoname) {
        const place = await mapGeonamesToTouristPlace(geoname, 0);
        setCache(cacheKey, place);
        return place;
      }
    } catch (error) {
      console.error(`Error fetching place details for ID ${placeId}:`, error);
    }
  }

  const localPlace = touristPlaces.find((place) => place.id === placeId);
  if (localPlace) return localPlace;

  return null;
}
