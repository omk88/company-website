'use client'

import Image from 'next/image'
import { Layers2 } from 'lucide-react'

interface ToolItem {
  id: string
  name: string
  imageUrl: string
}

interface ToolsGridProps {
  tools?: ToolItem[]
}

export default function ToolsGrid({ tools }: ToolsGridProps) {
  const defaultTools: ToolItem[] = [
    { id: '1', name: 'NextJS', imageUrl: '/nextjs.svg' },
    { id: '2', name: 'TypeScript', imageUrl: '/typescript.svg' },
    { id: '3', name: 'Vercel', imageUrl: '/vercel-2.svg' },
    { id: '4', name: 'Convex', imageUrl: '/convex.svg' },
    { id: '5', name: 'Stripe', imageUrl: '/stripe.svg' },
    { id: '6', name: 'Plaid', imageUrl: '/plaid.svg' },
  ]

  const displayTools = tools || defaultTools

  return (
    <div className="w-full py-2 md:py-2 relative z-10 box-border">
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused; /* Optional: pauses the slide on mouse hover */
        }
      `}</style>

      <div className="relative overflow-hidden border border-border/50 bg-card/70 backdrop-blur-md text-card-foreground p-8 sm:p-12 shadow-md shadow-black/5 dark:shadow-black/40 transition-all duration-300">
      
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-30 text-muted-foreground/40 dark:text-muted-foreground/30 pointer-events-none select-none">
          <Layers2 className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.2]" />
        </div>

        <div className="relative z-20">
          <div className="text-right mb-14 space-y-2 border-b border-border pb-6">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Technologies
            </h2>
            <p className="text-lg font-mono text-muted-foreground">
              Working with tools you trust.
            </p>
          </div>

          <div className="relative w-full overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]">
            
            <div className="flex w-max items-center gap-16 pr-16 animate-marquee">
              
              {displayTools.map((tool) => (
                <div 
                  key={`original-${tool.id}`} 
                  className="relative flex items-center justify-center w-28 sm:w-36 shrink-0"
                >
                  <div className="relative w-full h-14 transition-transform duration-300 ease-out hover:scale-110">
                    <Image
                      src={tool.imageUrl}
                      alt={tool.name}
                      fill
                      sizes="150px"
                      className="object-contain grayscale contrast-125 mix-blend-multiply dark:mix-blend-normal dark:invert transition-all duration-300 hover:grayscale-0"
                    />
                  </div>
                </div>
              ))}

              {displayTools.map((tool) => (
                <div 
                  key={`duplicate-${tool.id}`} 
                  className="relative flex items-center justify-center w-28 sm:w-36 shrink-0"
                >
                  <div className="relative w-full h-14 transition-transform duration-300 ease-out hover:scale-110">
                    <Image
                      src={tool.imageUrl}
                      alt={tool.name}
                      fill
                      sizes="150px"
                      className="object-contain grayscale contrast-125 mix-blend-multiply dark:mix-blend-normal dark:invert transition-all duration-300 hover:grayscale-0"
                    />
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}