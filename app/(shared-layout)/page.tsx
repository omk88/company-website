import TypewriterEffect from "@/components/web/TypeWriter";
import { Space_Grotesk } from 'next/font/google';
import { JetBrains_Mono } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['700'],
});

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] transition-colors duration-300 relative">
      
      <div className="fixed inset-0 w-screen h-screen pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[8%] left-[55%] w-[340px] h-[340px] rounded-full 
          bg-gradient-to-br from-neutral-200/60 via-neutral-300/40 to-neutral-100/10 
          blur-lg animate-pulse [animation-duration:10s] 
          shadow-[inset_-10px_-10px_25px_rgba(0,0,0,0.05),inset_10px_10px_25px_rgba(255,255,255,0.6),6px_6px_20px_rgba(0,0,0,0.03)]" 
        />

        <div className="absolute top-[28%] right-[-6%] w-[480px] h-[220px] rounded-full -rotate-12 
          bg-gradient-to-tr from-neutral-300/40 via-neutral-200/30 to-transparent 
          blur-xl" 
        />

        <div className="absolute bottom-[15%] left-[2%] w-[240px] h-[240px] rounded-full 
          bg-gradient-to-tr from-neutral-200/70 via-neutral-300/40 to-neutral-50/10 
          blur-lg animate-bounce [animation-duration:14s] 
          shadow-[inset_-8px_-8px_20px_rgba(0,0,0,0.04),inset_8px_8px_20px_rgba(255,255,255,0.7)]" 
        />

        <div className="absolute bottom-[-5%] right-[18%] w-[400px] h-[400px] rounded-full 
          bg-gradient-to-b from-neutral-200/30 via-transparent to-neutral-300/10 
          blur-2xl" 
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center text-center w-full">
          
          <div className="max-w-2xl flex flex-col items-center gap-8">
            
            <div className="flex flex-col items-center gap-6">
              <div className={`${spaceGrotesk.className} text-5xl font-extrabold text-neutral-950 tracking-tight`}>
                <TypewriterEffect /> 
              </div>
              
              <p className={`text-lg leading-relaxed text-neutral-950 font-semibold max-w-md opacity-85`}>
                Building software that pushes boundaries. <br />
                We are where the future happens.
              </p>
            </div>
            
            <div className="flex flex-row items-center gap-4 mt-2">
              
              <button className="px-7 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-sm rounded-full transition-all duration-200 active:scale-98 shadow-sm">
                Sign in
              </button>

              <button className="group px-6 py-3.5 bg-white/40 hover:bg-white/80 text-neutral-950 font-semibold text-sm rounded-full border border-neutral-200 transition-all duration-200 active:scale-98 flex items-center gap-2 shadow-sm">
                <span>See our products</span>
                <span className="w-5 h-5 bg-neutral-100 group-hover:bg-neutral-200 rounded-full flex items-center justify-center transition-colors duration-200">
                  <svg 
                    className="w-3 h-3 text-neutral-950 transform group-hover:translate-x-0.5 transition-transform duration-200" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>

            </div>
            
          </div>
          
        </div>
      </div>
    </div>
  );
}