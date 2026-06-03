import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import Technologies from "@/components/web/Technologies";
import Image from "next/image";

export default function About() {
  return (
    <div className="min-h-screen w-full relative">
      <div className="max-w-7xl mx-auto p-6 md:p-12 relative z-10 box-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Card className="flex flex-col justify-between overflow-hidden bg-white/70 backdrop-blur-md border-neutral-200/50">
            <div className="w-full aspect-[16/10] bg-muted/20 flex items-center justify-center relative overflow-hidden group">
              <Image
                src="/tools.png"
                alt="dashboard"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <CardHeader className="pt-2 flex flex-col gap-2">
              <CardTitle className="text-xl font-semibold tracking-tight">
                Providing tools that you need.
              </CardTitle>
              <CardContent className="p-0 text-sm md:text-base leading-relaxed text-muted-foreground">
                Delivering digital solutions to difficult problems. Pushing the bounds of what was thought possible.
              </CardContent>
            </CardHeader>
          </Card>

          <Card className="flex flex-col justify-between overflow-hidden bg-white/70 backdrop-blur-md border-neutral-200/50">
            <div className="w-full aspect-[16/10] bg-muted/20 flex items-center justify-center relative overflow-hidden group">
              <Image
                src="/lean.png"
                alt="process"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <CardHeader className="pt-2 flex flex-col gap-2">
              <CardTitle className="text-xl font-semibold tracking-tight">
                Staying lean. Doing what other organisations can't.
              </CardTitle>
              <CardContent className="p-0 text-sm md:text-base leading-relaxed text-muted-foreground">
                Working with agility. Responding to the market. Out maneuvering enterprises.
              </CardContent>
            </CardHeader>
          </Card>

          <Card className="flex flex-col justify-between overflow-hidden bg-white/70 backdrop-blur-md border-neutral-200/50">
            <div className="w-full aspect-[16/10] bg-muted/20 flex items-center justify-center relative overflow-hidden group">
              <Image
                src="/brain.png"
                alt="brain"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <CardHeader className="pt-2 flex flex-col gap-2">
              <CardTitle className="text-xl font-semibold tracking-tight">
                Innovating where it's desperately desired.
              </CardTitle>
              <CardContent className="p-0 text-sm md:text-base leading-relaxed text-muted-foreground">
                Architecturing effective platforms. Responding to novel challenges.
              </CardContent>
            </CardHeader>
          </Card>

        </div>
      </div>
      <Technologies />
    </div>
  );
}