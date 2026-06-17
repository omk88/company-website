"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const DynamicTypewriter = dynamic(() => import('typewriter-effect'), {
  ssr: false
});

interface TypewriterEffectProps {
  className?: string;
}

export default function TypewriterEffect({ className }: TypewriterEffectProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <span className={`text-foreground flex flex-row items-center justify-start gap-2 ${className || ''}`}>
      <span>{">"}</span>
      
      {mounted ? (
        <DynamicTypewriter
          options={{
            strings: ['Transformation.', 'Agility.', 'Velocity.', 'Ingenuity.', 'Disruption.', 'Innovation.'],
            autoStart: true,
            loop: true,
            delay: 40,     
            deleteSpeed: 30, 
          }}
        />
      ) : (
        <span className="opacity-0">Transformation.</span>
      )}
    </span>
  );
}