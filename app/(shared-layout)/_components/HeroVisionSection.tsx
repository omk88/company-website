'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function HeroVisionSection({ spaceGroteskClassName }: { spaceGroteskClassName: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center mt-16 text-center gap-4 px-4"
    >
      <h1
        className={cn(
          spaceGroteskClassName,
          "text-4xl md:text-6xl", 
          "font-semibold", 
          "tracking-tight", 
          "text-foreground",
          "leading-tight",
          "max-w-3xl"
        )}
      >
        Engineering the Next Generation of Software
      </h1>
      
      <p className="text-neutral-600 dark:text-neutral-400 text-xl font-light max-w-lg">
        Building with precision, speed, and modern architectural principles.
      </p>

      <div className="flex flex-wrap items-center gap-3 pt-1 isolate">
        <Link 
          href="/about" 
          style={{ backgroundColor: 'var(--accent-primary)' }}
          className="group px-4.5 py-2.5 font-medium text-xs sm:text-sm rounded-lg transition-all duration-100 hover:opacity-90 active:scale-[0.98] inline-flex items-center gap-2"
        >
          <span style={{ color: 'var(--accent-text-2)' }}>Explore our vision</span>
        </Link>
      </div>
    </motion.div>
  );
}