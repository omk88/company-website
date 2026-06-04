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
    <div className="w-full max-w-7xl mx-auto p-6 md:p-12 relative z-10 box-border">
      <div className="border border-border bg-card text-card-foreground p-8 sm:p-12">
        
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
              <div className="relative w-full h-20 max-w-[168px] mx-auto">
                <Image
                  src={tool.imageUrl}
                  alt={tool.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 16vw"
                  className="object-contain grayscale contrast-125 mix-blend-multiply dark:invert"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}