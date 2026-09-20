import NewsletterSubscriptionForm from "@/components/web/NewsletterSubscriptionForm";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import GitHubWorkbench from "@/components/web/GitHubWorkbench";
import { Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Solutions",
};

export default function Solutions() {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col md:flex-row items-center transition-colors duration-300 ease-in-out px-4 sm:px-8 md:px-12 lg:px-24 py-8 md:py-0 gap-12 md:gap-0">
      
      <div className="w-full md:w-1/2 flex items-center justify-center p-0 md:p-6 lg:p-12">
        <div className="flex flex-col gap-4 max-w-lg w-full">
          <div 
            className={cn(
              "flex flex-col gap-2 w-full",
              "text-neutral-600 dark:text-neutral-400"
            )}
          >
            <div className="inline-flex w-fit items-center gap-1.5 px-3.5 py-1 rounded-full bg-white dark:bg-neutral-900 border border-gray-200/80 dark:border-neutral-800 shadow-sm text-sm font-medium text-foreground">
              <Clock className="w-4 h-4 text-foreground" />
              <span>Waiting List</span>
            </div>
            
            <h1
              className={cn(
                "text-2xl sm:text-3xl md:text-4xl", 
                "font-semibold tracking-tight text-foreground",
                "leading-tight"
              )}
            >
              Join the waiting list
            </h1>
            
            <p className="font-light text-base sm:text-lg leading-relaxed text-balance">
              Stay updated on what we&apos;re building by joining the waiting list so you don&apos;t miss out on future updates.
            </p>
          </div>
          
          <div>
            <NewsletterSubscriptionForm size="lg" />
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-0 md:p-6 lg:p-12">
        <div className="w-full flex justify-center items-center overflow-hidden">
          <GitHubWorkbench />
        </div>
      </div>

    </div>
  );
}