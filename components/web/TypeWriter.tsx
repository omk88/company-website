"use client";

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const DynamicTypewriter = dynamic(() => import('typewriter-effect'), {
  ssr: false
});

export default function TypewriterEffect({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <span className={`text-foreground inline-flex items-center gap-2 ${className || ''}`}>
      <span className="text-neutral-400 dark:text-neutral-600 font-mono select-none">&gt;</span>
      {mounted ? (
        <DynamicTypewriter
          options={{
            strings: ['Agility', 'Velocity', 'Ingenuity', 'Disruption', 'Innovation', 'Transformation'],
            autoStart: true,
            loop: true,
            delay: 45, 
            deleteSpeed: 25, 
          }}
        />
      ) : (
        <span className="opacity-0">Transformation</span>
      )}
    </span>
  );
}