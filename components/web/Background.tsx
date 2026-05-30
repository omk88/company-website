
export default function Background() {
  return (
    <div className="fixed inset-0 w-screen h-screen pointer-events-none z-0 overflow-hidden bg-[#f8f9fa]">
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
  );
}