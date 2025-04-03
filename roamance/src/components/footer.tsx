import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram } from '@/components/Icons';
import { routes } from '@/constants/routes';

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-end gap-2">
              <Image
                src="/images/roamance-logo-no-text.png"
                alt="Roamance Logo"
                width={30}
                height={30}
                className="rounded-md"
              />
              <span className="text-xl font-bold">Roamance</span>
            </div>
            <p className="text-muted-foreground">
              Where every journey becomes a story. Discover, connect, and create
              unforgettable travel experiences.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={routes.destinations.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  href={routes.activities.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Activities
                </Link>
              </li>
              <li>
                <Link
                  href={routes.map.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Interactive Map
                </Link>
              </li>
              <li>
                <Link
                  href={routes.plans.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Travel Plans
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={routes.about.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href={routes.careers.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href={routes.blog.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Travel Blog
                </Link>
              </li>
              <li>
                <Link
                  href={routes.contact.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={routes.terms.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href={routes.privacy.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href={routes.cookies.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Roamance. All rights reserved.
          </p>

          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Facebook />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Twitter />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
