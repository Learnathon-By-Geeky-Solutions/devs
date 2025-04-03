import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthLinkProps {
  text: string;
  linkText: string;
  href: string;
  delay?: number;
}

export function AuthLink({ text, linkText, href, delay = 0.9 }: AuthLinkProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="text-center relative z-10"
    >
      <p className="text-sm text-muted-foreground">
        {text}{' '}
        <Link
          href={href}
          className="text-primary font-medium hover:text-primary/80 transition-colors duration-200 inline-flex items-center"
        >
          {linkText}
          <motion.span
            initial={{ x: 0 }}
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowRight className="inline-block ml-1 h-4 w-4" />
          </motion.span>
        </Link>
      </p>
    </motion.div>
  );
}
