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

      <div className="pt-2">
        <Link
          href="/about"
          className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 text-sm font-medium transition-all duration-200 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-[0.98] shadow-sm"
        >
          <span>Explore our vision</span>
        </Link>
      </div>
    </motion.div>
  );
}