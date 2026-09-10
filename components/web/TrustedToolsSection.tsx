import Image from 'next/image';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ToolItem {
  name: string;
  icon: string | LucideIcon | React.ComponentType<{ className?: string }>;
}

const toolsData: ToolItem[] = [
  { name: 'Next.js', icon: "/nextjs.svg" },
  { name: 'TypeScript', icon: "/typescript.svg" },
  { name: 'Convex', icon: '/convex.svg' },
  { name: 'Vercel', icon: "/vercel-2.svg" },
];

export default function TrustedToolsSection() {
  return (
    <section className="w-full border-y border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-100/50 dark:bg-neutral-900/30 py-8 relative isolate">
      <div className="w-full max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        
        <div className="shrink-0 text-left max-w-[200px]">
          <p className="text-xs sm:text-sm font-normal text-neutral-500 dark:text-neutral-400 leading-tight">
            Working with tools <br />
            <span className="text-neutral-700 dark:text-neutral-200 font-medium">you trust</span>
          </p>
        </div>

        <div className="w-full relative overflow-hidden isolate flex-1">
          
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-neutral-100/90 dark:from-neutral-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-neutral-100/90 dark:from-neutral-950 to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex items-center gap-12 md:gap-16 w-max"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              repeat: Infinity,
              repeatType: 'loop',
              duration: 25,
              ease: 'linear',
            }}
          >
            {[...toolsData, ...toolsData, ...toolsData, ...toolsData].map((tool, index) => (
              <div 
                key={`${tool.name}-${index}`} 
                className="shrink-0 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-200 flex items-center justify-center"
              >
                {typeof tool.icon === 'string' ? (
                  <Image 
                    src={tool.icon} 
                    alt={`${tool.name} logo`} 
                    width={32} 
                    height={32} 
                    className="h-7 w-auto dark:invert object-contain" 
                  />
                ) : (
                  <tool.icon className="h-7 w-7 text-neutral-800 dark:text-neutral-200" />
                )}
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}