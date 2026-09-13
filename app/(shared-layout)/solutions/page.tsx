import { Card } from "@/components/ui/card";
import NewsletterSubscriptionForm from "@/components/web/NewsletterSubscriptionForm";
import { cn } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solutions",
};

export default function Solutions() {
  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-row items-center transition-colors duration-300 ease-in-out">
      <div className="w-1/2 h-full border-r border-gray-300 dark:border-gray-700 flex justify-center items-center p-4">
        <div className="flex flex-col gap-6">
          <div 
            className={cn(
              "mt-6 relative flex flex-col w-full",
              "text-neutral-600 dark:text-neutral-400",
            )}
          >
            <h1
              className={cn(
                "pb-2 text-2xl sm:text-3xl md:text-4xl", 
                "font-semibold tracking-tight text-foreground",
                "leading-tight max-w-3xl"
              )}
            >
              Join the waiting list
            </h1>
            <p className="max-w-lg mx-auto font-light text-xl text-balance leading-relaxed">
              Stay updated on what we're building by joining the waiting list so you don't miss out of future updates.
            </p>
          </div>
          <div className="mb-20">
            <NewsletterSubscriptionForm />
          </div>
        </div>
      </div>

      <div className="w-1/2 h-full flex items-center justify-center text-center p-4">
      </div>
    </div>
  );
}