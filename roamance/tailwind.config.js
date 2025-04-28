/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from 'tailwindcss-animate';
import tailwindScrollbarHide from 'tailwind-scrollbar-hide';

module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        primary: ['var(--font-geist-sans)', 'sans-serif'],
        secondary: ['var(--font-geist-mono)', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        // Travel-specific theme colors
        ocean: {
          light: 'var(--ocean-light)',
          DEFAULT: 'var(--ocean)',
          dark: 'var(--ocean-dark)',
        },
        sunset: {
          light: 'var(--sunset-light)',
          DEFAULT: 'var(--sunset)',
          dark: 'var(--sunset-dark)',
        },
        forest: {
          light: 'var(--forest-light)',
          DEFAULT: 'var(--forest)',
          dark: 'var(--forest-dark)',
        },
        sand: {
          light: 'var(--sand-light)',
          DEFAULT: 'var(--sand)',
          dark: 'var(--sand-dark)',
        },
        mountain: {
          light: 'var(--mountain-light)',
          DEFAULT: 'var(--mountain)',
          dark: 'var(--mountain-dark)',
        },
        // New violet color scheme
        violet: {
          light: 'var(--violet-light)',
          DEFAULT: 'var(--violet)',
          dark: 'var(--violet-dark)',
        },
        lavender: {
          light: 'var(--lavender-light)',
          DEFAULT: 'var(--lavender)',
          dark: 'var(--lavender-dark)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        zoom: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        'globe-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'map-reveal': {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'scale-up-down': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        'fade-in-out': {
          '0%, 100%': { opacity: 0.5 },
          '50%': { opacity: 1 },
        },
        'slide-up-fade': {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        float: 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        zoom: 'zoom 4s ease-in-out infinite',
        'globe-spin': 'globe-spin 20s linear infinite',
        'map-reveal': 'map-reveal 1s ease-out',
        'spin-slow': 'spin-slow 8s linear infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'scale-up-down': 'scale-up-down 3s ease-in-out infinite',
        'fade-in-out': 'fade-in-out 3s ease-in-out infinite',
        'slide-up-fade': 'slide-up-fade 0.4s ease-out',
      },
      backgroundImage: {
        'world-map': "url('/world-map-pattern.png')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-travel': 'linear-gradient(45deg, #2980B9, #E67E22)',
        'gradient-violet': 'linear-gradient(45deg, #8e44ad, #9b59b6)',
      },
    },
  },
  plugins: [tailwindcssAnimate, tailwindScrollbarHide],
};
