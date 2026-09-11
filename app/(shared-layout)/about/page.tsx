import PersonCard from "@/components/PersonCard";
import Footer from "@/components/web/Footer";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Vision",
};

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

export default function About() {
  return (
    <div>

      <div className="flex flex-col items-center mt-16 text-center gap-4 px-4 py-10">
        <h1
          className={cn(
            spaceGrotesk.className,
            "text-3xl sm:text-4xl md:text-5xl", 
            "font-semibold", 
            "tracking-tight", 
            "text-foreground",
            "leading-tight",
            "max-w-3xl"
          )}
        >
          Developing effective solutions to difficult problems
        </h1>
        
        <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base font-light max-w-lg">
          TaQtiQ is a dedicated team of software engineers and IT professionals delivering innovative digital solutions. 
        </p>

        <div className="my-12 text-center">
          <h1
            className={cn(
              "py-6",
              "text-2xl sm:text-4xl md:text-3xl", 
              "font-semibold", 
              "tracking-tight", 
              "text-foreground",
              "leading-tight",
              "max-w-3xl"
            )}
          >
            Our team
          </h1>

          <PersonCard />
        </div>

      </div>
      
    <Footer />
    </div>
  );
}