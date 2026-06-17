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
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShouldRender(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <span className={`text-foreground flex flex-row items-center justify-start gap-2 ${className || ''}`}>
      <span>{">"}</span>
      {shouldRender ? (
        <DynamicTypewriter
          options={{
            strings: ['Agility.', 'Velocity.', 'Ingenuity.', 'Disruption.', 'Innovation.', 'Transformation.'],
            autoStart: true,
            loop: true,
            delay: 40,     
            deleteSpeed: 30, 
          }}
        />
      ) : null}
    </span>
  );
}