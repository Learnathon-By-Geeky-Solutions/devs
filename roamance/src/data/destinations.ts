export const destinations = [
  {
    title: 'Santorini',
    location: 'Greece',
    image:
      'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80',
    rating: 4.8,
    category: 'Islands',
  },
  {
    title: 'Kyoto',
    location: 'Japan',
    image:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    rating: 4.7,
    category: 'Cultural',
  },
  {
    title: 'Machu Picchu',
    location: 'Peru',
    image:
      'https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    rating: 4.9,
    category: 'Historical',
  },
  {
    title: 'Serengeti',
    location: 'Tanzania',
    image:
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1168&q=80',
    rating: 4.8,
    category: 'Wildlife',
  },
  {
    title: 'Bali',
    location: 'Indonesia',
    image:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1038&q=80',
    rating: 4.6,
    category: 'Beaches',
  },
  {
    title: 'Banff',
    location: 'Canada',
    image:
      'https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
    rating: 4.7,
    category: 'Mountains',
  },
];

// Add an interface for destination
export interface Destination {
  title: string;
  location: string;
  image: string;
  rating: number;
  category: string;
}

// Export categories as well for consistency
export const categories = [
  'All',
  'Islands',
  'Cultural',
  'Historical',
  'Wildlife',
  'Beaches',
  'Mountains',
];
