import Technologies from "@/components/web/Technologies";
import VisionCards from "@/components/web/VisionCards";
import VisionDescription from "@/components/web/VisionDescription";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vision",
};

export default function About() {
  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto px-6 md:px-12 relative pb-12">
      <h1 className="py-6 md:py-6 font-bold text-center text-xl md:text-2xl text-foreground tracking-tight">
        Building software that delivers.
      </h1>
      <VisionCards />
      <VisionDescription />
      <Technologies />
    </div>
  );
}