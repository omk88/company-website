import Image from 'next/image'

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
      <div className="relative overflow-hidden border border-border/50 bg-card/70 backdrop-blur-md text-card-foreground p-8 sm:p-12 shadow-md shadow-black/5 dark:shadow-black/40 transition-all duration-300">
      
        <div className="absolute right-[-5%] top-[-10%] w-[50%] h-[110%] pointer-events-none opacity-80 dark:opacity-40 hidden md:block select-none z-10 isolate will-change-transform transform translate-z-0" aria-hidden="true">
          <svg 
            viewBox="0 0 500 400" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-full h-full transform scale-110 origin-top-right"
          >
            <path d="M 150 0 C 250 120, 320 220, 500 240" stroke="currentColor" className="text-muted-foreground/40" strokeWidth="1" />
            <path d="M 180 0 C 275 130, 340 240, 500 265" stroke="currentColor" className="text-muted-foreground/35" strokeWidth="1" />
            <path d="M 210 0 C 300 140, 360 260, 500 290" stroke="currentColor" className="text-muted-foreground/30" strokeWidth="1" />
            <path d="M 240 0 C 325 150, 380 280, 500 315" stroke="currentColor" className="text-muted-foreground/25" strokeWidth="1" />
            <path d="M 270 0 C 350 160, 400 300, 500 340" stroke="currentColor" className="text-muted-foreground/20" strokeWidth="1" />
            <path d="M 300 0 C 375 170, 420 320, 500 365" stroke="currentColor" className="text-muted-foreground/15" strokeWidth="1" />
            <path d="M 330 0 C 400 180, 440 340, 500 390" stroke="currentColor" className="text-muted-foreground/10" strokeWidth="1" />
            <path d="M 360 0 C 425 190, 460 360, 500 415" stroke="currentColor" className="text-muted-foreground/5" strokeWidth="1" />
          </svg>
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

          <div className="grid grid-cols-2 gap-12 py-8 sm:grid-cols-3 sm:gap-16 md:grid-cols-6">
            {displayTools.map((tool) => (
              <div 
                key={tool.id} 
                className="relative flex items-center justify-center w-full"
              >
                <div className="relative w-full h-20 max-w-[168px] mx-auto transition-transform duration-300 ease-out hover:scale-110">
                  <Image
                    src={tool.imageUrl}
                    alt={tool.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 16vw"
                    className="object-contain grayscale contrast-125 mix-blend-multiply dark:mix-blend-normal dark:invert transition-all duration-300 hover:grayscale-0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}