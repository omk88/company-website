import Image from 'next/image';

export default function VisionDescription() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-12 relative z-10 box-border">
      <div className="border border-border bg-card text-card-foreground p-8 sm:p-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="flex flex-col h-full order-1 lg:order-1">
            <div className="mb-8 space-y-2 border-b border-border pb-6">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Why TaQtiQ?
              </h2>
              <p className="text-lg font-mono text-muted-foreground">
                Because real problems need addressing.
              </p>
            </div>
            <p className="p-0 text-sm md:text-base leading-relaxed text-accent-foreground">
              Modern enterprises struggle to innovate, and technology fails to deliver on its promises.  
              Painful problems go unaddressed. At TaQtiQ, we are asking the question, why is real 
              innovation so rare? Moving with speed. Executing with rapid precision. We are the 
              answer to the modern digital predicament.  At TaQtiQ, we're not just writing code. 
              We're architecting effective solutions to palpable problems and delivering them with 
              aggressive pace. Bold and defiant, we're not scared to break the mold. Going where 
              most wont go to find where true novelty lies.
            </p>
          </div>

          <div className="w-full aspect-[16/10] bg-muted/20 flex items-center justify-center relative overflow-hidden order-2 lg:order-2">
            <Image
              src="/columns.png"
              alt="Layered tabs representation"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

        </div>

      </div>
    </div>
  );
}