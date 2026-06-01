import TypewriterEffect from "@/components/web/TypeWriter";
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['700'],
});

export default function Home() {
  return (
    <div className="min-h-screen w-full relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center text-center w-full">
          <div className="max-w-2xl flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-6">
              <div className={`${spaceGrotesk.className} text-5xl font-extrabold text-neutral-950 tracking-tight`}>
                <TypewriterEffect /> 
              </div>
              <p className="text-lg leading-relaxed text-neutral-950 font-semibold max-w-md opacity-85">
                Building software that pushes boundaries. <br />
                We are where the future happens.
              </p>
            </div>
            
            <div className="flex flex-row items-center gap-4 mt-2">
              <button className="px-7 py-3.5 bg-white hover:bg-neutral-100 text-neutral-950 font-semibold text-sm rounded-full border border-neutral-200 transition-all duration-200 active:scale-98 shadow-sm">
                Sign in
              </button>
              
              <button className="group px-6 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-sm rounded-full transition-all duration-200 active:scale-98 flex items-center gap-2 shadow-sm">
                <span>See our products</span>
                <svg className="w-3 h-3 text-white transform group-hover:translate-x-0.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}