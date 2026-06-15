"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export default function GridBackground({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  let lineColor = "rgba(148, 163, 184, 0.15)"
  let backgroundColor = "rgb(255, 255, 255)" 

  if (mounted && resolvedTheme === "dark") {
    lineColor = "rgba(51, 65, 85, 0.3)"    
    backgroundColor = "rgb(3, 7, 18)"      
  }

  return (
    <div 
      className="min-h-screen w-full transition-colors duration-300 relative overflow-hidden"
      style={{ backgroundColor }}
    >
      
      <div 
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${lineColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px', 
          
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