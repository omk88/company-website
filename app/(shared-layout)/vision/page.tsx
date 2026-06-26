import Technologies from "@/components/web/Technologies";
import VisionCards from "@/components/web/VisionCards";
import VisionDescription from "@/components/web/VisionDescription";
import { TrendingUp } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vision",
};

export default function About() {
  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto px-6 md:px-12 relative pb-12">
      <div className="py-6 md:py-6 flex items-center justify-center gap-2.5 text-foreground">
        <TrendingUp className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5] shrink-0" />
        <h1 className="font-bold text-xl md:text-2xl tracking-tight text-center">
          Building software that delivers.
        </h1>
      </div>
      <VisionCards />
      <VisionDescription />
      <Technologies />
    </div>
  );
}