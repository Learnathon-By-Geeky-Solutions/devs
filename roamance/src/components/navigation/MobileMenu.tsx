import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { routes } from '@/constants/routes';
import { authService } from '@/service/auth-service';
import { Globe, LogOut, MapPin, PlaneTakeoff, Umbrella, User } from 'lucide-react';

type MobileMenuProps = {
  isMenuOpen: boolean;
  isAuthenticated: boolean;
  toggleMenu: () => void;
};

export function MobileMenu({ isMenuOpen, isAuthenticated, toggleMenu }: MobileMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthRoute = pathname?.startsWith('/auth');

  const handleProfileClick = () => {
    if (isAuthenticated) {
      router.push(routes.profile.href);
    } else {
      router.push(routes.signIn.href);
    }
    toggleMenu();
  };

  const handleLogout = () => {
    authService.logout();
    router.push(routes.home.href);
    toggleMenu();
  };

  return (
    <div
      className={cn(
        'md:hidden fixed inset-x-0 top-16 transition-all duration-300 ease-in-out',
        isMenuOpen
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-full pointer-events-none'
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/70 backdrop-blur-xl" />
      <div className="absolute inset-0 opacity-30 mix-blend-soft-light bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMjAwdjIwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />

      <div className="relative container px-4 py-4 flex flex-col gap-4">
        <Link
          href={routes.map.href}
          className="flex items-center gap-3 p-3 hover:bg-muted/60 rounded-lg cursor-pointer transition-colors duration-200"
          onClick={toggleMenu}
        >
          <div className="bg-primary/10 p-2 rounded-md">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <span className="font-medium">Explore Map</span>
        </Link>
        <Link
          href={routes.destinations.href}
          className="flex items-center gap-3 p-3 hover:bg-muted/60 rounded-lg cursor-pointer transition-colors duration-200"
          onClick={toggleMenu}
        >
          <div className="bg-primary/10 p-2 rounded-md">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <span className="font-medium">Destinations</span>
        </Link>
        <Link
          href={routes.activities.href}
          className="flex items-center gap-3 p-3 hover:bg-muted/60 rounded-lg cursor-pointer transition-colors duration-200"
          onClick={toggleMenu}
        >
          <div className="bg-primary/10 p-2 rounded-md">
            <Umbrella className="h-5 w-5 text-primary" />
          </div>
          <span className="font-medium">Activities</span>
        </Link>
        <Link
          href={routes.plans.href}
          className="flex items-center gap-3 p-3 hover:bg-muted/60 rounded-lg cursor-pointer transition-colors duration-200"
          onClick={toggleMenu}
        >
          <div className="bg-primary/10 p-2 rounded-md">
            <PlaneTakeoff className="h-5 w-5 text-primary" />
          </div>
          <span className="font-medium">Travel Plans</span>
        </Link>
        <div className="flex flex-col gap-3 pt-3 border-t mt-1">
          {!isAuthRoute && (
            <>
              <Button
                variant="outline"
                className="w-full justify-start cursor-pointer rounded-lg py-5 transition-colors"
                onClick={handleProfileClick}
              >
                <User
                  className={cn(
                    'h-5 w-5 mr-3',
                    isAuthenticated ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
                <span className="font-medium">
                  {isAuthenticated ? 'Your Profile' : 'Sign In'}
                </span>
              </Button>

              {isAuthenticated && (
                <Button
                  variant="outline"
                  className="w-full justify-start cursor-pointer rounded-lg py-5 transition-colors text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span className="font-medium">Logout</span>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
