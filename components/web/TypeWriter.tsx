"use client";

import dynamic from 'next/dynamic';

const DynamicTypewriter = dynamic(() => import('typewriter-effect'), {
  ssr: false,
  loading: () => <span>Innovation.</span> 
});

export default function TypewriterEffect() {
  return (
    <span className="text-black flex flex-row items-center justify-start gap-2">
      <span>{">"}</span>
      <DynamicTypewriter
        options={{
          strings: ['Agility.', 'Velocity.', 'Ingenuity.', 'Disruption.', 'Innovation.', 'Transformation.'],
          autoStart: true,
          loop: true,
          delay: 40,     
          deleteSpeed: 30, 
        }}
      />
    </span>
  );
}