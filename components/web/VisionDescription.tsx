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
          className="border border-border bg-card text-card-foreground p-8 sm:p-12 h-full flex flex-col justify-center shadow-md shadow-black/5 dark:shadow-black/40 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/60 transition-all duration-300 ease-out hover:-translate-y-1"
          style={{
            animation: hasIntersected 
              ? `slideRightFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards` 
              : "none",
            opacity: hasIntersected ? 1 : 0,
          }}
        >
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

        <div className="w-full h-[400px] lg:h-[500px] flex items-center justify-center relative overflow-hidden">
          <GridCube models={ABOUT_MODELS} storageKey="aboutpage_cube_path" />
        </div>

      </div>
    </div>
  );
}