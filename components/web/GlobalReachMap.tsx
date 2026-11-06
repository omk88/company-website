"use client";

export function GlobalReachMap() {
  return (
    <div className="w-full bg-transparent relative">
      <div className="relative w-full aspect-[3/1] bg-transparent overflow-hidden flex items-center justify-center">
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center p-2 opacity-50 dark:opacity-40"
          style={{
            maskImage: "radial-gradient(circle at center, black 70%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(circle at center, black 70%, transparent 100%)"
          }}
        >
          <img 
            src="/world.svg" 
            alt="World Map Grid" 
            className="w-full h-full object-contain filter invert dark:invert-0"
          />
        </div>
      </div>
    </div>
  );
}