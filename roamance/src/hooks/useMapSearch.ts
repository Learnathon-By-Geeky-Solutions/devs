import { useState, useEffect } from 'react';
import { searchGeonames } from '@/api/places-api';

export interface SearchResult {
  name: string;
  lat: number;
  lng: number;
  country?: string;
  adminName?: string;
  population?: number;
}

export function useMapSearch(searchQuery: string) {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Handle search functionality
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.length < 3) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const geonames = await searchGeonames(searchQuery);

        // Map Geoname objects to the format expected by SearchResults
        const formattedResults = geonames
          .filter((geoname) => geoname.lat && geoname.lng && geoname.name)
          .map((geoname) => ({
            name: geoname.toponymName || geoname.name,
            lat: parseFloat(geoname.lat),
            lng: parseFloat(geoname.lng),
            country: geoname.countryName || '',
            adminName: geoname.adminName1 || '',
            population: geoname.population || 0,
          }))
          .slice(0, 10);

        setSearchResults(formattedResults);
      } catch (error) {
        console.error('Error searching locations:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSearchResults();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return { searchResults, isSearching, setSearchResults };
}
