import { Space_Grotesk } from 'next/font/google';
import Link from 'next/link';

import TypewriterEffect from "@/components/web/TypeWriter";
import GridCube from '@/components/3d/GridCube';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['700'],
});

export default function Home() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center py-12 lg:py-0">
      <div className="w-full max-w-6xl mx-auto px-6 relative z-10 box-border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center w-full justify-items-center">
          
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-lg gap-8 lg:justify-self-center">
            <div className="flex flex-col items-center lg:items-start gap-6 w-full">
              <TypewriterEffect className={`${spaceGrotesk.className} text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-none`} /> 
              
              <p className="text-lg leading-relaxed text-foreground font-semibold max-w-md opacity-85">
                Building software that pushes boundaries. <br />
                We are where the future happens.
              </p>
            </div>
            
            <div className="flex flex-row items-center gap-4 mt-2">
              <Link 
                href="/sign-in" 
                className="inline-block px-7 py-3.5 bg-background dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground font-semibold text-sm rounded-full border border-neutral-200 dark:border-neutral-800 transition-all duration-200 active:scale-98 shadow-sm text-center"
              >
                Sign in
              </Link>
              
              <Link 
                href="/products" 
                className="group px-6 py-3.5 bg-foreground hover:bg-foreground/90 text-background font-semibold text-sm rounded-full transition-all duration-200 active:scale-98 inline-flex items-center gap-2 shadow-sm"
              >
                <span>See our products</span>
                <svg className="w-3 h-3 text-background transform group-hover:translate-x-0.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="w-full aspect-square max-w-md lg:max-w-[460px] mx-auto">
            <GridCube />
          </div>

        </div>
      </div>
    </div>
  );
}