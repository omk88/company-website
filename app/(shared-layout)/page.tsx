"use client";

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Space_Grotesk } from 'next/font/google';
import { ArrowRight, ChevronRight, Terminal } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6'; 
import { AiOutlineInstagram } from 'react-icons/ai';
import { RxLinkedinLogo } from 'react-icons/rx';
import Footer from '@/components/web/Footer';
import { cn } from '@/lib/utils';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import TrustedToolsSection from '@/components/web/TrustedToolsSection';
import VisionCards from '@/components/web/VisionCards';
import InteractiveCodeBox from '@/components/web/InteractiveCodeBox';
import { GlobalReachMap } from '@/components/web/GlobalReachMap';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

const DynamicTypewriter = dynamic(() => import('typewriter-effect'), {
  ssr: false
});

function TypewriterEffect({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <span className={`text-foreground inline-flex items-center gap-2 ${className || ''}`}>
      <span className="text-neutral-400 dark:text-neutral-600 font-mono select-none">&gt;</span>
      {mounted ? (
        <DynamicTypewriter
          options={{
            strings: ['Agility', 'Velocity', 'Ingenuity', 'Disruption', 'Innovation', 'Transformation'],
            autoStart: true,
            loop: true,
            delay: 45, 
            deleteSpeed: 25, 
          }}
        />
      ) : (
        <span className="opacity-0">Transformation</span>
      )}
    </span>
  );
}

function BackgroundGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  
  const xMovement = useTransform(scrollYProgress, [0, 1], ['20%', '60%']);
  const yMovement = useTransform(scrollYProgress, [0, 1], ['30%', '70%']);
  const spotlightX = useSpring(xMovement, { stiffness: 50, damping: 20 });
  const spotlightY = useSpring(yMovement, { stiffness: 50, damping: 20 });

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full -z-10 overflow-hidden isolate pointer-events-none">
      <div 
        className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(#888 1px, transparent 1px),
            linear-gradient(90deg, #888 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[140px] opacity-20 dark:opacity-30 bg-emerald-300/60 dark:bg-emerald-600/50"
        style={{
          x: spotlightX,
          y: spotlightY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
    </div>
  );
}

export default function Home() {
  return (
    <div className="pt-16 w-full relative bg-neutral-50 dark:bg-neutral-950 min-h-screen text-foreground antialiased isolate flex flex-col">
      <BackgroundGrid />

      <div className="max-w-6xl mx-auto w-full border-x border-neutral-200 dark:border-neutral-800 flex-1">
        
        <section className="w-full flex items-center justify-center pb-14 min-h-[calc(100vh-4rem)]">
          <div className="w-full px-4 sm:px-8 mt-4">
            
            <div className="w-full bg-white/90 dark:bg-neutral-900/80 backdrop-blur-lg rounded-lg border border-neutral-200/70 dark:border-neutral-800/80 shadow-md overflow-hidden isolate">
              
              <div className="flex flex-row p-8 my-10 sm:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-15 gap-4 items-center">
                
                <div className="lg:col-span-7 flex flex-col items-start text-left gap-7 isolate">
                  
                  <Link
                    href="/insights"
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full bg-neutral-100/90 dark:bg-neutral-800/80 hover:bg-neutral-200/70 dark:hover:bg-neutral-800 px-3.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 transition-colors border border-neutral-200 dark:border-neutral-700/60 shadow-xs"
                    )}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Insights</span>
                    <ChevronRight className="h-3.5 w-3.5 text-neutral-400" strokeWidth={1.5} />
                  </Link>

                  <div className="space-y-3.5 isolate">
                    <h1 className={cn(spaceGrotesk.className, "text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.15]")}>
                      <TypewriterEffect />
                    </h1>
                    
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-600 dark:text-neutral-400 max-w-md font-normal">
                      Building software that pushes boundaries. We are where the future of digital engineering happens.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1 isolate">
                    <Link 
                      href="/products" 
                      className="group px-4.5 py-2.5 bg-foreground hover:bg-foreground/90 text-background font-medium text-xs sm:text-sm rounded-lg transition-all duration-150 active:scale-[0.98] inline-flex items-center gap-2 shadow-sm"
                    >
                      <span>See our solutions</span>
                      <ArrowRight 
                        className="w-4 h-4 transform transition-transform duration-150 group-hover:translate-x-0.5" 
                        strokeWidth={2} 
                      />
                    </Link>

                    <Link 
                      href="/sign-in" 
                      className="px-4.5 py-2.5 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800/80 text-foreground font-medium text-xs sm:text-sm rounded-lg border border-neutral-200 dark:border-neutral-800 transition-colors duration-150 active:scale-[0.98] text-center"
                    >
                      Sign in
                    </Link>
                  </div>
                </div>

                <InteractiveCodeBox />

              </div>

              <div className="px-8 sm:px-12 py-3.5 bg-neutral-50/50 dark:bg-neutral-950/30 border-t border-neutral-200/50 dark:border-neutral-800/50 flex items-center justify-between text-xs text-neutral-500 isolate">
                <div className="flex items-center gap-4 isolate ml-auto">
                  <Link href="https://x.com/TaQtiQ_tech" target="_blank" rel="noopener noreferrer" aria-label="X">
                    <FaXTwitter className="h-4 w-4 hover:text-foreground transition-colors" />
                  </Link>
                  <Link href="https://www.instagram.com/taqtiq_tech" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <AiOutlineInstagram className="h-4.5 w-4.5 hover:text-foreground transition-colors" />
                  </Link>
                  <Link href="https://www.linkedin.com/company/taqtiq-tech" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <RxLinkedinLogo className="h-4.5 w-4.5 hover:text-foreground transition-colors" />
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </section>

        <TrustedToolsSection />

        <div className="flex flex-col items-center mt-16 text-center gap-4 px-4">
          <h1
            className={cn(
              spaceGrotesk.className,
              "text-3xl sm:text-4xl md:text-5xl", 
              "font-semibold", 
              "tracking-tight", 
              "text-foreground",
              "leading-tight",
              "max-w-3xl"
            )}
          >
            Engineering the Next Generation of Software
          </h1>
          
          <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base font-light max-w-lg">
            Building with precision, speed, and modern architectural principles.
          </p>

          <div className="pt-2">
            <Link
              href="#vision"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 text-sm font-medium transition-all duration-200 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-[0.98] shadow-sm"
            >
              <span>Explore our vision</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className='my-10'>
          <VisionCards />
        </div>

        <div className="flex flex-col items-center mt-16 text-center gap-4 px-4">
          <h1
            className={cn(
              spaceGrotesk.className,
              "text-3xl sm:text-4xl md:text-5xl", 
              "font-semibold", 
              "tracking-tight", 
              "text-foreground",
              "leading-tight",
              "max-w-3xl"
            )}
          >
            Designed for Global Reach, built for Zero Latency.
          </h1>
          
          <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base font-light max-w-lg">
            Solutions that are truly boundless.
          </p>
        </div>

        <GlobalReachMap />
      </div>

      <Footer />
    </div>
  );
}