import GridCube from "../3d/GridCube";

const ABOUT_MODELS = ['/cloud.glb']

export default function VisionDescription() {
  return (
    <div className="w-full py-8 relative z-10 box-border">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        <div className="border border-border bg-card text-card-foreground p-8 sm:p-12 h-full flex flex-col justify-center shadow-md shadow-foreground/5 hover:shadow-xl hover:shadow-foreground/10 transition-all duration-300 ease-out hover:-translate-y-1">
          <div className="mb-8 space-y-2 border-b border-border pb-6">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Why TaQtiQ?
            </h2>
            <p className="text-lg font-mono text-muted-foreground">
              Relentless innovation.
            </p>
          </div>
          <p className="p-0 text-sm md:text-base leading-relaxed text-muted-foreground">
            Modern enterprises struggle to innovate, and technology fails to deliver on its promises.  
            Painful problems go unaddressed. At TaQtiQ, we are asking the question, why is real 
            innovation so rare? Moving with speed. Executing with rapid precision. We are the 
            answer to the modern digital predicament.  At TaQtiQ, we're not just writing code. 
            We're architecting effective solutions to palpable problems and delivering them with 
            aggressive pace. Bold and defiant, we're not scared to break the mold. Going where 
            most wont go to find where true novelty lies.
          </p>
        </div>

        <div className="w-full h-[400px] lg:h-[500px] flex items-center justify-center relative overflow-hidden">
          <GridCube models={ABOUT_MODELS} storageKey="aboutpage_cube_path" />
        </div>

      </div>
    </div>
  );
}