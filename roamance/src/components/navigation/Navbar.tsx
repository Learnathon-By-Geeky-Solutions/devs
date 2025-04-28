'use client';

import { ThemeToggle } from '@/components/common/theme-toggle';
import * as React from 'react';
import { DesktopNav } from './DesktopNav';
import { MobileMenu } from './MobileMenu';
import { MobileNav } from './MobileNav';
import { NavLogo } from './NavLogo';
import { UserMenu } from './UserMenu';

interface NavbarProps {
  title?: string;
}

export function Navbar({ title }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const checkAuth = () => {
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find((cookie) =>
        cookie.trim().startsWith('access_token=')
      );
      setIsAuthenticated(!!tokenCookie);
    };

    checkAuth();

    const intervalId = setInterval(checkAuth, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="fixed top-0 z-50 w-full shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
      {/* Background effects */}
      <div className="absolute inset-0 bg-background/80 dark:bg-background/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-primary/10 to-purple-500/10 dark:from-blue-500/15 dark:via-primary/15 dark:to-purple-500/15" />
      <div className="absolute inset-0 backdrop-blur-lg" />
      <div className="absolute inset-0 opacity-20 mix-blend-soft-light bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMjAwdjIwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-b from-transparent to-black/3 dark:to-black/5"></div>

      <nav className="relative h-16">
        <div className="container mx-auto flex items-center justify-between h-full px-4 md:px-6">
          {/* Logo with optional title */}
          <div className="flex items-center gap-1">
            <NavLogo />
            {title && (
              <h1 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {title}
              </h1>
            )}
          </div>

          {/* Desktop navigation links */}
          <DesktopNav />

          <div className="flex items-center gap-3">
            {/* Theme toggle (desktop only) */}
            <div className="hidden md:flex">
              <ThemeToggle className="hover:bg-muted/80" />
            </div>

            {/* User menu (desktop) */}
            <UserMenu isAuthenticated={isAuthenticated} />

            {/* Mobile menu button */}
            <MobileNav isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <MobileMenu
        isMenuOpen={isMenuOpen}
        isAuthenticated={isAuthenticated}
        toggleMenu={toggleMenu}
      />
    </div>
  );
}
