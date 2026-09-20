import Image from 'next/image';

import convexIcon from './convex.svg';
import nextjsIcon from './nextjs.svg';
import typescriptIcon from './typescript.svg';
import vercelIcon from './vercel.svg';

interface ToolItem {
  name: string;
  icon: any; 
  className?: string;
}

const toolsData: ToolItem[] = [
  { name: 'Next.js', icon: nextjsIcon, className: 'h-5 w-auto' },
  { name: 'TypeScript', icon: typescriptIcon, className: 'h-5 w-auto' },
  { name: 'Convex', icon: convexIcon, className: 'h-5 w-auto' },
  { name: 'Vercel', icon: vercelIcon, className: 'h-5 w-auto' },
];

export default function TrustedToolsSection() {
  return (
    <section className="w-full border-y border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-100/50 dark:bg-neutral-900/30 py-4 sm:py-8 overflow-x-auto no-scrollbar">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-10 min-w-max sm:min-w-0">
        
        <div className="shrink-0 text-left">
          <p className="text-xs sm:text-xl font-light text-neutral-500 dark:text-neutral-400 leading-tight">
            Working with tools{' '}
            <span className="text-neutral-700 dark:text-neutral-200 font-medium block sm:inline">
              you trust
            </span>
          </p>
        </div>

        <div className="flex items-center justify-end gap-8 shrink-0">
          {toolsData.map((tool) => (
            <div 
              key={tool.name} 
              className="h-6 sm:h-10 shrink-0 flex items-center justify-center"
            >
              <Image 
                src={tool.icon} 
                alt={`${tool.name} logo`} 
                className={`${tool.className ?? 'h-5 sm:h-8 w-auto'} grayscale brightness-0 dark:invert object-contain`}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}