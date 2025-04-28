import { DynamicRouteItem, RouteItem } from '@/types';

export const paths = {
  home: '',
  map: 'map',
  destinations: 'destinations',
  activities: 'activities',
  plans: 'plans',
  profile: 'profile',

  auth: 'auth',
  signIn: 'sign-in',
  signUp: 'sign-up',

  about: 'about',
  careers: 'careers',
  blog: 'blog',
  contact: 'contact',

  terms: 'terms',
  privacy: 'privacy',
  cookies: 'cookies',

  info: 'info',
  preferences: 'preferences',
  trips: 'trips',
  journals: 'journals',
  places: 'places',
} as const;

export const pathTitles = {
  home: 'Home',
  map: 'Map',
  destinations: 'Destinations',
  activities: 'Activities',
  plans: 'Plans',
  profile: 'Profile',

  signIn: 'Sign In',
  signUp: 'Sign Up',

  about: 'About',
  careers: 'Careers',
  blog: 'Blog',
  contact: 'Contact',

  terms: 'Terms of Service',
  privacy: 'Privacy Policy',
  cookies: 'Cookies Policy',

  info: 'Information',
  preferences: 'Preferences',
  trips: 'My Trips',
  journals: 'Journals',
  places: 'Places',
} as const;

export const routes: {
  home: RouteItem;
  map: RouteItem;
  destinations: RouteItem;
  activities: RouteItem;
  plans: RouteItem;
  profile: RouteItem;
  signIn: RouteItem;
  signUp: RouteItem;
  about: RouteItem;
  careers: RouteItem;
  blog: RouteItem;
  contact: RouteItem;
  terms: RouteItem;
  privacy: RouteItem;
  cookies: RouteItem;
  info: RouteItem;
  preferences: RouteItem;
  trips: RouteItem;
  journals: RouteItem;
  journalDetail: DynamicRouteItem;
  places: RouteItem;
} = {
  home: {
    title: pathTitles.home,
    href: `/${paths.home}`,
  },
  map: {
    title: pathTitles.map,
    href: `/${paths.map}`,
  },
  destinations: {
    title: pathTitles.destinations,
    href: `/${paths.destinations}`,
  },
  activities: {
    title: pathTitles.activities,
    href: `/${paths.activities}`,
  },
  plans: {
    title: pathTitles.plans,
    href: `/${paths.plans}`,
  },
  profile: {
    title: pathTitles.profile,
    href: `/${paths.profile}`,
  },

  signIn: {
    title: pathTitles.signIn,
    href: `/${paths.auth}/${paths.signIn}`,
  },
  signUp: {
    title: pathTitles.signUp,
    href: `/${paths.auth}/${paths.signUp}`,
  },

  about: {
    title: pathTitles.about,
    href: `/${paths.about}`,
  },
  careers: {
    title: pathTitles.careers,
    href: `/${paths.careers}`,
  },
  blog: {
    title: pathTitles.blog,
    href: `/${paths.blog}`,
  },
  contact: {
    title: pathTitles.contact,
    href: `/${paths.contact}`,
  },

  terms: {
    title: pathTitles.terms,
    href: `/${paths.terms}`,
  },
  privacy: {
    title: pathTitles.privacy,
    href: `/${paths.privacy}`,
  },
  cookies: {
    title: pathTitles.cookies,
    href: `/${paths.cookies}`,
  },

  /* --------------------------------- Profile -------------------------------- */

  info: {
    title: pathTitles.info,
    href: `/${paths.profile}/${paths.info}`,
  },
  preferences: {
    title: pathTitles.preferences,
    href: `/${paths.profile}/${paths.preferences}`,
  },
  trips: {
    title: pathTitles.trips,
    href: `/${paths.profile}/${paths.trips}`,
  },
  journals: {
    title: pathTitles.journals,
    href: `/${paths.profile}/${paths.journals}`,
  },
  journalDetail: (id) => ({
    title: pathTitles.journals,
    href: `/${paths.profile}/${paths.journals}/${id}`,
  }),
  places: {
    title: pathTitles.places,
    href: `/${paths.profile}/${paths.places}`,
  },
} as const;

export const secureRoutes = [routes.profile.href] as const;
