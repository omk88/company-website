import Link from 'next/link';
import { Space_Grotesk } from 'next/font/google';
import Footer from '@/components/web/Footer';
import { cn } from '@/lib/utils';
import VisionCards from '@/components/web/VisionCards';
import { GlobalReachMap } from '@/components/web/GlobalReachMap';
import TypewriterEffect from '@/components/web/TypeWriter';
import TrustedToolsSection from './_components/TrustedToolsSection';
import HeroVisionSection from './_components/HeroVisionSection';
import { FaXTwitter } from 'react-icons/fa6';
import { AiOutlineInstagram } from 'react-icons/ai';
import { RxLinkedinLogo } from 'react-icons/rx';
import Image from "next/image";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

export default function Home() {
  return (
    <div className="pt-16 w-full relative bg-neutral-50 dark:bg-neutral-950 min-h-screen text-foreground antialiased isolate flex flex-col">

      <div className="mx-auto w-full flex-1">
        
        {/* Hero Section */}
        <section 
          style={{ backgroundColor: 'var(--accent-background)' }} 
          className="w-full flex flex-col justify-between relative z-10 shadow-xs dark:[background-color:var(--accent-dark-background)]"
        >
          <div className="w-full px-4 sm:px-8 my-auto">
            <div className="w-full overflow-hidden">
              <div className="p-8 sm:p-12 items-center">
                <div className="flex flex-col items-center text-center gap-4 isolate">
                  <div className="w-full isolate">
                    <h1 className={cn(spaceGrotesk.className, "text-7xl font-semibold tracking-tight text-foreground dark:text-white leading-[1.15]")}>
                      <TypewriterEffect />
                    </h1>
                  </div>

                  <p style={{ color: 'var(--accent-text-1)' }} className="text-xl leading-relaxed max-w-md font-normal dark:text-slate-300">
                    Building software that pushes boundaries. We are where the future happens.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 isolate">
                    <Link 
                      href="/solutions" 
                      style={{ backgroundColor: 'var(--accent-primary)' }}
                      className="group px-4.5 py-2.5 font-medium text-xs sm:text-sm rounded-lg transition-all duration-100 hover:opacity-90 active:scale-[0.98] inline-flex items-center gap-2 text-white"
                    >
                      <span>See our solutions</span>
                    </Link>
                  </div>
                  <div className="px-8 sm:px-12 mt-4 flex items-center justify-center text-xs text-neutral-500">
                    <div className="flex items-center gap-4">
                      <Link href="https://x.com/TaQtiQ_tech" target="_blank" rel="noopener noreferrer" aria-label="X">
                        <FaXTwitter className="h-5 w-5 hover:text-foreground transition-colors" />
                      </Link>
                      <Link href="https://www.instagram.com/taqtiq_tech" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <AiOutlineInstagram className="h-5.5 w-5.5 hover:text-foreground transition-colors" />
                      </Link>
                      <Link href="https://www.linkedin.com/company/taqtiq-tech" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <RxLinkedinLogo className="h-5.5 w-5.5 hover:text-foreground transition-colors" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-neutral-950 w-full flex flex-col gap-20 relative z-0">
          <HeroVisionSection spaceGroteskClassName={spaceGrotesk.className} />

          <div>
            <VisionCards />
          </div>

          <div className='mb-10'>
            <TrustedToolsSection />
          </div>
        </section>

        {/* Global Reach Section */}
        <section 
          style={{ backgroundColor: 'var(--accent-background)' }} 
          className="shadow-xs w-full py-20 md:py-28 flex flex-col items-center dark:[background-color:var(--accent-dark-background)]"
        >
          <div className="flex flex-col items-center text-center gap-4 px-4">
            <h2
              className={cn(
                spaceGrotesk.className,
                "text-4xl md:text-6xl", 
                "font-semibold", 
                "tracking-tight", 
                "text-foreground",
                "dark:text-white",
                "leading-tight",
                "max-w-3xl"
              )}
            >
              Designed for Global Reach, built for Zero Latency
            </h2>
            
            <p style={{ color: 'var(--accent-text-1)' }} className="text-xl leading-relaxed max-w-md font-normal dark:text-slate-300">
              Solutions that are truly boundless.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 isolate">
              <Link 
                href="/insights" 
                style={{ backgroundColor: 'var(--accent-primary)' }}
                className="group px-4.5 py-2.5 font-medium text-xs sm:text-sm rounded-lg transition-all duration-100 hover:opacity-90 active:scale-[0.98] inline-flex items-center gap-2 text-white"
              >
                <span>Read our insights</span>
              </Link>
            </div>
          </div>

          <div className="w-full mt-12">
            <GlobalReachMap />
          </div>
        </section>    

        <section className='mt-12 mb-12 px-12'>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col text-left gap-4">
              <h2
                className={cn(
                  spaceGrotesk.className,
                  "text-4xl md:text-6xl", 
                  "font-semibold", 
                  "tracking-tight", 
                  "text-foreground",
                  "leading-tight",
                  "max-w-3xl"
                )}
              >
                What is TaQtiQ?
              </h2>
              <p className="text-xl leading-relaxed font-normal">
                TaQtiQ is a London-based software development firm. We focus on driving progress within the technology sector with our innovative approach to problem solving. 
              </p>
              <p className="text-xl leading-relaxed font-normal">
                At TaQtiQ, we want to challenge existing thinking and open new possibilities for Britain and the world through software.
              </p>
            </div>
            
            <div className="relative w-full h-[350px] md:h-[400px]">
              <Image 
                src="/london-skyline.jpg" 
                alt="London Skyline" 
                fill
                quality={90}
                className="rounded-2xl object-cover"
                priority
              />
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}