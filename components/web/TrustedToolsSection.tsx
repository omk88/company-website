import Image from 'next/image';
import { LucideIcon } from 'lucide-react';

interface ToolItem {
  name: string;
  icon: string | LucideIcon | React.ComponentType<{ className?: string }>;
  className?: string;
}

const toolsData: ToolItem[] = [
  { name: 'Next.js', icon: '/nextjs.svg', className: 'h-7 max-w-[120px]' },
  { name: 'TypeScript', icon: '/typescript.svg', className: 'h-10 w-auto' },
  { name: 'Convex', icon: '/convex.svg', className: 'h-20 max-w-[130px]' },
  { name: 'Vercel', icon: '/vercel-2.svg', className: 'h-7 max-w-[120px]' },
];

export default function TrustedToolsSection() {
  return (
    <section className="w-full border-y border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-100/50 dark:bg-neutral-900/30 py-8">
      <div className="w-full max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
        
        <div className="shrink-0 text-left max-w-[200px]">
          <p className="text-xl font-light text-neutral-500 dark:text-neutral-400 leading-tight">
            Working with tools <br />
            <span className="text-neutral-700 dark:text-neutral-200 font-medium">you trust</span>
          </p>
        </div>

        <div className="w-full flex-1 flex flex-wrap items-center justify-center md:justify-end gap-6 sm:gap-8">
          {toolsData.map((tool) => (
            <div 
              key={tool.name} 
              className="w-32 h-10 shrink-0 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-200 flex items-center justify-center"
            >
              {typeof tool.icon === 'string' ? (
                <Image 
                  src={tool.icon} 
                  alt={`${tool.name} logo`} 
                  width={160} 
                  height={60} 
                  className={`${tool.className ?? 'h-8 w-auto'} dark:invert object-contain`} 
                />
              ) : (
                <tool.icon className={`${tool.className ?? 'h-8 w-8'} text-neutral-800 dark:text-neutral-200`} />
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}