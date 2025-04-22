import { TouristPlace } from '@/types';

export const touristPlaces: TouristPlace[] = [
  {
    id: '1',
    name: 'Eiffel Tower',
    lat: 48.8584,
    lng: 2.2945,
    country: 'France',
    description:
      'Iconic iron tower built in 1889, offering city views from observation decks',
    color: 'var(--ocean)',
    size: 1.2,
    image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?q=80&w=400&auto=format',
  },
  {
    id: '2',
    name: 'Great Wall of China',
    lat: 40.4319,
    lng: 116.5704,
    country: 'China',
    description:
      'Ancient defensive wall spanning thousands of miles across northern China',
    color: 'var(--sunset)',
    size: 1.2,
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=400&auto=format',
  },
  {
    id: '3',
    name: 'Machu Picchu',
    lat: -13.1631,
    lng: -72.545,
    country: 'Peru',
    description:
      '15th-century Inca citadel nestled on a mountain ridge 2,430 meters above sea level',
    color: 'var(--forest)',
    size: 1.2,
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=400&auto=format',
  },
  {
    id: '4',
    name: 'Taj Mahal',
    lat: 27.1751,
    lng: 78.0421,
    country: 'India',
    description:
      'Magnificent marble mausoleum built by Emperor Shah Jahan in memory of his wife',
    color: 'var(--ocean)',
    size: 1.2,
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=400&auto=format',
  },
  {
    id: '5',
    name: 'Grand Canyon',
    lat: 36.1069,
    lng: -112.1129,
    country: 'USA',
    description:
      'Vast natural wonder carved by the Colorado River with layered bands of red rock',
    color: 'var(--sunset)',
    size: 1.2,
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=400&auto=format',
  },
  {
    id: '6',
    name: 'Santorini',
    lat: 36.3932,
    lng: 25.4615,
    country: 'Greece',
    description:
      'Stunning island known for whitewashed, cubiform houses overlooking the sea',
    color: 'var(--primary)',
    size: 1.2,
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d945772b?q=80&w=400&auto=format',
  },
  {
    id: '7',
    name: 'Pyramids of Giza',
    lat: 29.9792,
    lng: 31.1342,
    country: 'Egypt',
    description:
      'Ancient monuments built as tombs for pharaohs, including the Great Pyramid',
    color: 'var(--forest)',
    size: 1.2,
    image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=400&auto=format',
  },
];
