import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import Image from "next/image";

const sampleImages = [
  { src: "https://i.ibb.co/F4yP9FDf/next-js-512h.png", alt: "nextjs" },
  { src: "https://i.ibb.co/SXzY1cVP/typescript.png", alt: "typescript" },
  { src: "https://i.ibb.co/4whWk3XB/convex.png", alt: "convex" },
  { src: "https://i.ibb.co/7xYvqk1M/vercel.png", alt: "vercel" },
  { src: "https://i.ibb.co/R4yWNGcQ/stripe.png", alt: "stripe" },
  { src: "https://i.ibb.co/k6J57kYS/plaid.png", alt: "plaid" },
];

export default function About() {
  return (
    <div className="min-h-screen w-full relative">
      <div className="max-w-7xl mx-auto p-6 md:p-12 relative z-10 box-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Card className="flex flex-col justify-between overflow-hidden bg-white/70 backdrop-blur-md border-neutral-200/50">
            <div className="w-full aspect-[16/10] bg-muted/20 flex items-center justify-center relative overflow-hidden group">
              <Image
                src="https://i.ibb.co/zVXDm46p/Firefly-Gemini-Flash-monochrome-gray-simple-software-dashboard-without-text-or-specific-icons-sleek.png"
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
                src="https://i.ibb.co/1fqKZ9xf/Firefly-Gemini-Flash-monochrome-gray-simple-software-development-process-staying-lean-doing-what-ot.png"
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
                src="https://i.ibb.co/PsDWwyXZ/Firefly-Gemini-Flash-monochrome-gray-brain-white-background-235534.png"
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
    </div>
  );
}