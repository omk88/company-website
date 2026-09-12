"use client";

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

export default function BackgroundGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  
  const xMovement = useTransform(scrollYProgress, [0, 1], ['20%', '60%']);
  const yMovement = useTransform(scrollYProgress, [0, 1], ['30%', '70%']);
  const spotlightX = useSpring(xMovement, { stiffness: 50, damping: 20 });
  const spotlightY = useSpring(yMovement, { stiffness: 50, damping: 20 });

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full -z-10 overflow-hidden isolate pointer-events-none">
      <div 
        className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(#888 1px, transparent 1px),
            linear-gradient(90deg, #888 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[140px] opacity-20 dark:opacity-30 bg-emerald-300/60 dark:bg-emerald-600/50"
        style={{
          x: spotlightX,
          y: spotlightY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
    </div>
  );
}