import Link from 'next/link';
import { routes } from '@/constants/routes';
import { Globe, MapPin, PlaneTakeoff, Umbrella } from 'lucide-react';

export function DesktopNav() {
  return (
    <div className="hidden md:flex items-center justify-center space-x-4">
      <NavLink
        href={routes.map.href}
        icon={<MapPin className="h-4 w-4 text-blue-400 group-hover:text-blue-500 transition-colors duration-200" />}
        hoverColor="blue"
        label="Explore Map"
      />
      <NavLink
        href={routes.destinations.href}
        icon={<Globe className="h-4 w-4 text-purple-400 group-hover:text-purple-500 transition-colors duration-200" />}
        hoverColor="purple"
        label="Destinations"
      />
      <NavLink
        href={routes.activities.href}
        icon={<Umbrella className="h-4 w-4 text-emerald-400 group-hover:text-emerald-500 transition-colors duration-200" />}
        hoverColor="emerald"
        label="Activities"
      />
      <NavLink
        href={routes.plans.href}
        icon={<PlaneTakeoff className="h-4 w-4 text-amber-400 group-hover:text-amber-500 transition-colors duration-200" />}
        hoverColor="amber"
        label="Travel Plans"
      />
    </div>
  );
}

type NavLinkProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  hoverColor: 'blue' | 'purple' | 'emerald' | 'amber';
};

function NavLink({ href, icon, label, hoverColor }: NavLinkProps) {
  const colorMap = {
    blue: {
      text: 'hover:text-blue-500',
      bg: 'from-blue-50/50 to-cyan-50/50 dark:from-blue-900/10 dark:to-cyan-900/10',
      underline: 'bg-blue-500'
    },
    purple: {
      text: 'hover:text-purple-500',
      bg: 'from-purple-50/50 to-fuchsia-50/50 dark:from-purple-900/10 dark:to-fuchsia-900/10',
      underline: 'bg-purple-500'
    },
    emerald: {
      text: 'hover:text-emerald-500',
      bg: 'from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/10 dark:to-teal-900/10',
      underline: 'bg-emerald-500'
    },
    amber: {
      text: 'hover:text-amber-500',
      bg: 'from-amber-50/50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/10',
      underline: 'bg-amber-500'
    }
  };

  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-all duration-200 ${colorMap[hoverColor].text} flex items-center gap-2 cursor-pointer relative group px-3 py-1.5`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${colorMap[hoverColor].bg} opacity-0 group-hover:opacity-100 rounded-xl transition-all duration-300`} />
      <div className={`absolute inset-x-0 h-0.5 ${colorMap[hoverColor].underline} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 -bottom-1 rounded-full`} />
      {icon}
      <span className="relative z-10">{label}</span>
    </Link>
  );
}
