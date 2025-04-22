import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

type MobileNavProps = {
  isMenuOpen: boolean;
  toggleMenu: () => void;
};

export function MobileNav({ isMenuOpen, toggleMenu }: MobileNavProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden cursor-pointer rounded-full hover:bg-muted/80 transition-colors"
      onClick={toggleMenu}
    >
      {isMenuOpen ? (
        <X className="h-5 w-5" />
      ) : (
        <Menu className="h-5 w-5" />
      )}
    </Button>
  );
}
