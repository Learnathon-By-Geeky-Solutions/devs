export const paths = {
  home: '',
  map: 'map',
  destinations: 'destinations',
  activities: 'activities',
  plans: 'plans',

  // Authentication paths
  auth: 'auth',
  signIn: 'sign-in',
  signUp: 'sign-up',

  // Company paths
  about: 'about',
  careers: 'careers',
  blog: 'blog',
  contact: 'contact',

  // Legal paths
  terms: 'terms',
  privacy: 'privacy',
  cookies: 'cookies',
};

export const pathTitles = {
  home: 'Home',
  map: 'Map',
  destinations: 'Destinations',
  activities: 'Activities',
  plans: 'Plans',

  // Authentication titles
  signIn: 'Sign In',
  signUp: 'Sign Up',

  // Company titles
  about: 'About',
  careers: 'Careers',
  blog: 'Blog',
  contact: 'Contact',

  // Legal titles
  terms: 'Terms of Service',
  privacy: 'Privacy Policy',
  cookies: 'Cookies Policy',
};

export const routes = {
  // Home and main navigation
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

  // Authentication routes
  signIn: {
    title: pathTitles.signIn,
    href: `/${paths.auth}/${paths.signIn}`,
  },
  signUp: {
    title: pathTitles.signUp,
    href: `/${paths.auth}/${paths.signUp}`,
  },

  // Company routes
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

  // Legal routes
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
};
