'use client';

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import GridCube from "../3d/GridCube";

const ABOUT_MODELS = ['/cloud.glb']

export default function VisionDescription() {
  const [hasIntersected, setHasIntersected] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setHasIntersected(false);

    const observerTarget = cardRef.current;
    if (!observerTarget) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasIntersected(true);
          observer.unobserve(observerTarget);
        }
      },
      {
        rootMargin: "-40px 0px -40px 0px", 
        threshold: 0.1,
      }
    );

    observer.observe(observerTarget);
    return () => {
      if (observerTarget) observer.unobserve(observerTarget);
    };
  }, [pathname]);

  return (
    <div className="w-full py-8 relative z-10 box-border">
      <style>{`
        @keyframes slideRightFade {
          from {
            opacity: 0;
            transform: translateX(-32px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        <div 
          ref={cardRef}
          className="relative overflow-hidden border border-border/50 bg-card/70 backdrop-blur-md text-card-foreground p-8 sm:p-12 h-full flex flex-col justify-center shadow-md shadow-black/5 dark:shadow-black/40 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/60 transition-all duration-300 ease-out hover:-translate-y-1"
          style={{
            animation: hasIntersected 
              ? `slideRightFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards` 
              : "none",
            opacity: hasIntersected ? 1 : 0,
          }}
        >
          <div className="absolute left-[-15%] bottom-[-20%] w-[80%] h-[80%] pointer-events-none opacity-80 dark:opacity-40 select-none z-10 isolate will-change-transform transform translate-z-0" aria-hidden="true">
            <svg 
              viewBox="0 0 500 500" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-full h-full transform scale-110 origin-bottom-left"
            >
              <circle cx="120" cy="380" r="60" stroke="currentColor" className="text-muted-foreground/45" strokeWidth="1" />
              <circle cx="120" cy="380" r="90" stroke="currentColor" className="text-muted-foreground/40" strokeWidth="1" />
              <circle cx="120" cy="380" r="120" stroke="currentColor" className="text-muted-foreground/35" strokeWidth="1" />
              <circle cx="120" cy="380" r="150" stroke="currentColor" className="text-muted-foreground/30" strokeWidth="1" />
              <circle cx="120" cy="380" r="185" stroke="currentColor" className="text-muted-foreground/25" strokeWidth="1" />
              <circle cx="120" cy="380" r="225" stroke="currentColor" className="text-muted-foreground/20" strokeWidth="1" />
              <circle cx="120" cy="380" r="270" stroke="currentColor" className="text-muted-foreground/15" strokeWidth="1" />
              <circle cx="120" cy="380" r="320" stroke="currentColor" className="text-muted-foreground/10" strokeWidth="1" />
              <circle cx="120" cy="380" r="375" stroke="currentColor" className="text-muted-foreground/8" strokeWidth="1" />
              <circle cx="120" cy="380" r="435" stroke="currentColor" className="text-muted-foreground/5" strokeWidth="1" />
            </svg>
          </div>

          <div className="relative z-20">
            <div className="mb-8 space-y-2 border-b border-border pb-6">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Why TaQtiQ?
              </h2>
              <p className="text-lg font-mono text-muted-foreground">
                Relentless innovation.
              </p>
            </div>
            <p className="p-0 text-sm md:text-base leading-relaxed text-muted-foreground">
              Modern enterprises struggle to innovate, and technology fails to deliver on its promises.  
              Painful problems go unaddressed. At TaQtiQ, we are asking the question, why is real 
              innovation so rare? Moving with speed. Executing with rapid precision. We are the 
              answer to the modern digital predicament.  At TaQtiQ, we're not just writing code. 
              We're architecting effective solutions to palpable problems and delivering them with 
              aggressive pace. Bold and defiant, we're not scared to break the mold. Going where 
              most wont go to find where true novelty lies.
            </p>
          </div>
        </div>

        <div className="w-full h-[400px] lg:h-[500px] flex items-center justify-center relative overflow-hidden">
          <GridCube models={ABOUT_MODELS} storageKey="aboutpage_cube_path" />
        </div>

      </div>
    </div>
  );
}