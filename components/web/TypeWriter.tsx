"use client";

import Typewriter from 'typewriter-effect';

export default function TypewriterEffect() {
  return (
    <span className="text-black flex flex-row items-center justify-start gap-2">
      <span>{">"}</span>
      <Typewriter
        options={{
          strings: ['Agility.', 'Velocity.', 'Disruption.', 'Innovation.'],
          autoStart: true,
          loop: true,
          delay: 40,     
          deleteSpeed: 30, 
        }}
      />
    </span>
  );
}