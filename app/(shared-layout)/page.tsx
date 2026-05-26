import TypewriterEffect from "@/components/web/TypeWriter";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";


export default function Home() {
  return (
    <div className="mt-50">
      <div className="flex flex-row items-center justify-start gap-8 flex-wrap">
        
        <div className="min-w-[800px] shrink-0">
          <TypewriterEffect /> 
        </div>

        <Link 
          className={cn(
            buttonVariants({ variant: "outline" }), 
            "text-xl font-bold uppercase tracking-wider px-10 py-7 h-auto border-2 gap-4 rounded-none"
          )} 
          href="/products"
        > 
          View products <ArrowRight className="size-6"/>
        </Link>
      </div>
    </div>
  );
}