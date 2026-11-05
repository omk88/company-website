import PersonCard from "@/components/web/PersonCard";
import Footer from "@/components/web/Footer";
import HeroTitle from "@/components/web/HeroTitle";
import OurValues from "@/components/web/OurValues";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
};

export default function About() {
  return (
    <>
      <div className="max-w-6xl mx-auto w-full flex-1">

        <div className="flex flex-col items-center mt-16 text-center gap-4">
          <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <HeroTitle />
            
            <p className="text-neutral-600 dark:text-neutral-400 text-xl font-light max-w-lg">
              TaQtiQ is a dedicated team of software engineers and IT professionals delivering innovative digital solutions. 
            </p>

            <Link 
              href="/careers" 
              className="group px-4.5 py-2.5 bg-foreground hover:bg-foreground/90 text-background font-medium text-xs sm:text-sm rounded-lg transition-all duration-150 active:scale-[0.98] inline-flex items-center gap-2 shadow-sm"
            >
              <span>View careers</span>
            </Link>
          </div>

          <div 
            className={cn(
              "relative flex flex-col items-center w-full my-12 py-12 px-4",
              "border-y border-neutral-200/80 dark:border-neutral-800/80",
              "text-neutral-600 dark:text-neutral-400",
              "bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#262626_1px,transparent_1px)]",
              "[background-size:16px_16px]"
            )}
          >
            <h2
              className={cn(
                "pb-4 text-2xl sm:text-3xl md:text-4xl", 
                "font-semibold tracking-tight text-foreground",
                "leading-tight max-w-3xl text-center"
              )}
            >
              Redefining standards, not just following them
            </h2>

            <p className="max-w-lg mx-auto text-center font-light text-xl leading-relaxed">
              Spotting gaps in current technologies and rapidly developing novel solutions. TaQtiQ combines deep systems expertise with an action-oriented approach to software design. At TaQtiQ, we're not just writing code. We're architecting effective, scalable platforms and redefining problems to get technology to deliver on its promises.
            </p>
          </div>

          <div className="text-center">
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

          <OurValues />

        </div>
        
      </div>
      <Footer />
    </>
  );
}