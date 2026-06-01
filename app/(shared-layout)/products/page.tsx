export default function Products() {
  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-white text-center">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">
          Products
        </p>
        
        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-950 sm:text-6xl">
          Coming soon
          <span className="inline-flex">
            <span className="animate-dot-1">.</span>
            <span className="animate-dot-2">.</span>
            <span className="animate-dot-3">.</span>
          </span>
        </h1>
        
        <p className="text-5xl text-neutral-500 max-w-sm mx-auto pt-2">
          👽
        </p>
      </div>
    </div>
  );
}