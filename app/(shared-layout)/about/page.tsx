import PersonCard from "@/components/web/PersonCard";
import Footer from "@/components/web/Footer";
import HeroTitle from "@/components/web/HeroTitle";
import OurValues from "@/components/web/OurValues";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
};

export default function About() {
  return (
    <div className="pt-16 w-full relative bg-neutral-50 dark:bg-neutral-950 min-h-screen text-foreground antialiased isolate flex flex-col overflow-x-hidden">
      <div className="w-full flex-1 flex flex-col">

        <section className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-20 md:py-28 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center">
          <div className="flex flex-col items-center justify-center gap-4">
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
        </section>

        <section 
          className={cn(
            "w-screen relative left-1/2 -translate-x-1/2 py-20 md:py-28 px-4 sm:px-8 lg:px-12 flex flex-col items-center",
            "border-y border-neutral-200/80 dark:border-neutral-800/80",
            "text-neutral-600 dark:text-neutral-400",
            "bg-white dark:bg-neutral-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#262626_1px,transparent_1px)]",
            "[background-size:16px_16px]"
          )}
        >
          <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center">
            <h2
              className={cn(
                "pb-4 text-2xl sm:text-3xl md:text-4xl", 
                "font-semibold tracking-tight text-foreground",
                "leading-tight max-w-3xl"
              )}
            >
              Redefining standards, not just following them
            </h2>

            <p className="max-w-lg mx-auto font-light text-xl leading-relaxed">
              Spotting gaps in current technologies and rapidly developing novel solutions. TaQtiQ combines deep systems expertise with an action-oriented approach to software design. At TaQtiQ, we're not just writing code. We're architecting effective, scalable platforms and redefining problems to get technology to deliver on its promises.
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-20 md:py-28 text-center flex flex-col items-center">
          <h2
            className={cn(
              "pb-8",
              "text-2xl sm:text-4xl md:text-3xl", 
              "font-semibold", 
              "tracking-tight", 
              "text-foreground",
              "leading-tight",
              "max-w-3xl"
            )}
          >
            Our team
          </h2>

          <div className="w-full">
            <PersonCard />
          </div>
        </section>

        <div className="w-screen relative left-1/2 -translate-x-1/2">
          <OurValues />
        </div>

      </div>
      <Footer />
    </div>
  );
}