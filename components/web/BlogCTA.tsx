import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import NewsletterSubscriptionForm from "./NewsletterSubscriptionForm";

export function BlogCTA() {
  return (
    <div className="my-6 p-4 rounded-lg bg-neutral-50 border border-neutral-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      
      <div className="space-y-2 lg:col-span-5 text-center lg:text-left">
        <h3 className="text-xl font-bold tracking-tight text-neutral-900">
          Ready to see what we're building?
        </h3>
        <p className="text-neutral-500 text-sm max-w-md mx-auto lg:mx-0">
          Explore our suite of products designed to make your life a whole lot easier.
        </p>
        <div className="pt-2">
          <Link 
            href="/products" 
            className={buttonVariants({ 
              variant: "default", 
              size: "sm", 
              className: "gap-2 whitespace-nowrap bg-neutral-950 text-neutral-50 hover:bg-neutral-800 shadow-sm transition-colors w-full sm:w-auto" 
            })}
          >
            Explore Products
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      <div className="hidden lg:block lg:col-span-1 h-24 w-px bg-neutral-200 mx-auto" />

      <div className="space-y-3 lg:col-span-6 w-full max-w-md mx-auto lg:max-w-none">
        <div className="text-center lg:text-left">
          <h4 className="text-base font-semibold text-neutral-900">
            Stay up to date
          </h4>
          <p className="text-neutral-500 text-sm">
            Subscribe to our newsletter so you don't miss out on our latest updates.
          </p>
        </div>
        
        <div className="w-full">
          <NewsletterSubscriptionForm />
        </div>
      </div>

    </div>
  );
}