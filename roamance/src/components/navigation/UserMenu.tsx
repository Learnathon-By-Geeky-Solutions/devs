import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LogOut, User } from 'lucide-react';
import { routes } from '@/constants/routes';
import { authService } from '@/service/auth-service';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type UserMenuProps = {
  isAuthenticated: boolean;
};

export function UserMenu({ isAuthenticated }: UserMenuProps) {
  const router = useRouter();

  const handleProfileClick = () => {
    if (isAuthenticated) {
      router.push(routes.profile.href);
    } else {
      router.push(routes.signIn.href);
    }
  };

  const handleLogout = () => {
    authService.logout();
    router.push(routes.home.href);
  };

  if (isAuthenticated) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "hidden md:flex rounded-full cursor-pointer transition-all duration-300 relative",
              "bg-white/10 dark:bg-slate-900/30 hover:bg-white/20 dark:hover:bg-slate-800/50",
              "backdrop-blur-md shadow-sm border border-white/20 dark:border-slate-800/50",
              "group"
            )}
            title="Your Profile"
          >
            <User className="h-[18px] w-[18px] text-primary group-hover:text-primary/90 transition-colors" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-background animate-pulse-slow"></span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-60 p-0 overflow-hidden border-white/20 dark:border-slate-800/50 shadow-xl"
          align="end"
          sideOffset={8}
        >
          <div className="relative overflow-hidden">
            {/* Glassmorphism background layers */}
            <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/80 backdrop-blur-xl z-0"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/10 dark:from-primary/10 dark:via-blue-500/10 dark:to-purple-500/20 z-0 opacity-80"></div>

            {/* Header with avatar */}
            <div className="relative z-10 p-4 flex flex-col items-center border-b border-slate-200/50 dark:border-slate-700/50">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/30 dark:from-primary/30 dark:to-blue-500/40 flex items-center justify-center mb-2 shadow-inner border border-white/30 dark:border-slate-700/50"
              >
                <User className="h-6 w-6 text-primary" />
              </motion.div>
              <p className="text-sm font-medium text-foreground">User Account</p>
              <p className="text-xs text-muted-foreground">Signed in</p>
            </div>

            {/* Menu items */}
            <div className="relative z-10 p-2 space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start rounded-md bg-transparent hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-200"
                onClick={handleProfileClick}
              >
                <User className="mr-2 h-4 w-4 text-primary" />
                <span>Profile</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start rounded-md bg-transparent hover:bg-red-500/10 hover:text-red-600 dark:hover:bg-red-500/20 transition-all duration-200"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4 text-primary" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "hidden md:flex rounded-full cursor-pointer transition-all duration-300",
        "bg-white/10 dark:bg-slate-900/30 hover:bg-white/20 dark:hover:bg-slate-800/50",
        "backdrop-blur-md shadow-sm border border-white/20 dark:border-slate-800/50"
      )}
      onClick={handleProfileClick}
      title="Sign In"
    >
      <User className="h-[18px] w-[18px] text-muted-foreground hover:text-primary transition-colors" />
    </Button>
  );
}
