"use client";

import Typewriter from 'typewriter-effect';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  weight: ['700'] 
});

export default function TypewriterEffect() {
  return (
    <div className={`${spaceGrotesk.className} text-8xl font-bold`}>
      <span className="text-black">
        <Typewriter
          options={{
            strings: ['Agility', 'Velocity', 'Disruption', 'Innovation'],
            autoStart: true,
            loop: true,
            delay: 40,     
            deleteSpeed: 30, 
          }}
        />
      </span>
    </div>
  );
}