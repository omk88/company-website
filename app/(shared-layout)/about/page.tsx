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
    <>
      <div className="max-w-6xl mx-auto w-full border-x border-neutral-200 dark:border-neutral-800 flex-1">

        <div className="flex flex-col items-center mt-16 text-center gap-4 py-10">
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

          <div className="w-full my-12 py-6 border-y border-neutral-200/80 dark:border-neutral-800/80 text-neutral-600 dark:text-neutral-400">
            <p className="max-w-lg mx-auto text-center">
              Spotting gaps in current technologies and rapidly developing novel solutions. TaQtiQ combines deep systems expertise with an action oriented approach to software design. At TaQtiQ, we're not just writing code. We're architecting effective, scalable platforms and redefining problems to get technology to deliver on its promises.
            </p>
          </div>

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
        
      </div>
      <Footer />
    </>
  );
}