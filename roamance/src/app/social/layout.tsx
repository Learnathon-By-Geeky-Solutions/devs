'use client';

import { Navbar } from '@/components/navigation';
import { SocialProvider } from '@/context/SocialContext';
import React, { useState, useEffect } from 'react';
import { DesktopSideNavigation, MobileSideNavigation } from '@/components/social/SideNavigation';
import { routes } from '@/constants/routes';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

const SocialLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const rawPath = usePathname();
  const [activeTab, setActiveTab] = useState<string>(rawPath ?? routes.social.href);
  useEffect(() => {
    setActiveTab(rawPath ?? routes.social.href);
  }, [rawPath]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <SocialProvider>
      <div className="min-h-screen bg-gradient-to-tr from-gray-50 via-purple-50/30 to-indigo-50/40 dark:from-gray-900 dark:via-purple-950/10 dark:to-indigo-950/10">
        {/* Using the Navbar component with title */}
        <Navbar title="RoamSocial" />

        {/* Content starts after the navbar */}
        <div className="pt-20">
          <main className="container mx-auto px-4 py-6">
            {/* Mobile menu button - visible only on mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden mb-4 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Desktop Side Navigation */}
              <DesktopSideNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

              {/* Mobile Navigation */}
              <MobileSideNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
              />

              {/* Main content */}
              {children}
            </div>
          </main>
        </div>
      </div>
    </SocialProvider>
  );
};

export default SocialLayout;
