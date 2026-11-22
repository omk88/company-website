"use client";

import { Wrench, Zap } from "lucide-react";

export default function RedesignedVisionCards() {
  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-4 font-sans">
      
      <div className=" gap-6 w-full rounded-3xl dark:bg-neutral-950 p-6 flex flex-col justify-center text-center items-center">
        
        <div 
          style={{ 
            backgroundColor: 'color-mix(in srgb, var(--accent-primary) 12%, transparent)',
            color: 'var(--accent-primary)'
          }}
          className="relative w-fit z-10 p-2 rounded-md group-hover:scale-105 transition-transform duration-200 shrink-0"
        >
          <Wrench className="w-8 h-8 stroke-[1.75]" />
        </div>

        <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
          Providing tools that you need.
        </h3>
        
        <p className="text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Delivering digital solutions to difficult problems. Pushing boundaries.
        </p>
      </div>

      <div className="gap-6 w-full rounded-3xl dark:bg-neutral-950 p-6 flex flex-col justify-center text-center items-center">
        <div 
          style={{ 
            backgroundColor: 'color-mix(in srgb, var(--accent-primary) 12%, transparent)',
            color: 'var(--accent-primary)'
          }}
          className="relative w-fit z-10 p-2 rounded-md group-hover:scale-105 transition-transform duration-200 shrink-0"
        >
          <Zap className="w-8 h-8 stroke-[1.75]" />
        </div>
        
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
          Staying lean. Doing what others can't.
        </h3>

        <p className="text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Working with agility. Responding to the market. Out maneuvering enterprises.
        </p>
      </div>

      <div className="gap-6 w-full rounded-3xl dark:bg-neutral-950 p-6 flex flex-col justify-center text-center items-center">
        <div 
          style={{ 
            backgroundColor: 'color-mix(in srgb, var(--accent-primary) 12%, transparent)',
            color: 'var(--accent-primary)'
          }}
          className="relative w-fit z-10 p-2 rounded-md group-hover:scale-105 transition-transform duration-200 shrink-0"
        >
          <Zap className="w-8 h-8 stroke-[1.75]" />
        </div>
        
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
          Innovating where it's desperately desired.
        </h3>

        <p className="text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Architecting effective platforms. Addressing novel challenges with aggressive pace.
        </p>
      </div>

    </div>
  );
}