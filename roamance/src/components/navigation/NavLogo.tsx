import Image from 'next/image';
import Link from 'next/link';
import { routes } from '@/constants/routes';

export function NavLogo() {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={routes.home.href}
        className="flex items-center gap-2 cursor-pointer transition-opacity duration-200 hover:opacity-80"
      >
        <Image
          src="/images/roamance-logo-no-text.png"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-md"
        />
      </Link>
    </div>
  );
}
