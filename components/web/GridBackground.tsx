"use client"

import { useEffect, useState } from "react"

export default function GridBackground({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div 
      className="w-full bg-white dark:bg-[#030712] relative [--line-color:rgba(148,163,184,0.3)] dark:[--line-color:rgba(51,65,85,0.3)]"
    >
      
      <div 
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--line-color) 1px, transparent 1px),
            linear-gradient(to bottom, var(--line-color) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          backgroundPosition: '-1px -1px', 
          
          maskImage: `
            linear-gradient(to bottom, white 70%, transparent 100%),
            repeating-linear-gradient(0deg, transparent, transparent 4px, white 4px, white 8px),
            repeating-linear-gradient(90deg, transparent, transparent 4px, white 4px, white 8px)
          `,
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in, source-in', 
          WebkitMaskImage: `
            linear-gradient(to bottom, white 70%, transparent 100%),
            repeating-linear-gradient(0deg, transparent, transparent 4px, white 4px, white 8px),
            repeating-linear-gradient(90deg, transparent, transparent 4px, white 4px, white 8px)
          `,
        }}
      />

      <div className="relative z-10">
        {children}
      </div>

    </div>
  )
}