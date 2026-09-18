"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react"; 
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api"; 
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react"; 
import { cn } from "@/lib/utils";

interface NewsletterSubscriptionFormProps {
  size?: "default" | "lg";
}

export default function NewsletterSubscriptionForm({ 
  size = "default" 
}: NewsletterSubscriptionFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const runSubscribe = useMutation(api.subscribers.subscribe);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      const message = await runSubscribe({ email: email.trim() });
      if (message === "Success!") {
        toast.success("Thank you for subscribing!");
        setEmail("");
      } else {
        toast.info(message); 
      }
    } catch {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLg = size === "lg";

  return (
    <form 
      onSubmit={handleSubscribe} 
      className={cn(
        "flex flex-col sm:flex-row gap-2.5 w-full",
        isLg ? "sm:w-full max-w-md" : "sm:w-80"
      )}
    >
      <Input 
        type="email"
        required
        disabled={isSubmitting}
        placeholder="Enter your email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={cn(
          "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-400 transition-all",
          isLg 
            ? "h-12 rounded-xl px-4 text-lg md:text-base placeholder:text-zinc-400" 
            : "h-10 rounded-lg px-4 md:px-3 text-lg md:text-sm"
        )}
      />
      
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className={cn(
          "cursor-pointer bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 font-semibold shrink-0 gap-2 transition-all active:scale-95",
          isLg 
            ? "h-12 px-6 text-lg md:text-sm rounded-xl" 
            : "h-10 px-6 md:px-4 text-base md:text-xs rounded-lg"
        )}
      >
        {isSubmitting ? (
          <Loader2 className={cn("animate-spin", isLg ? "w-4 h-4" : "w-3.5 h-3.5")} />
        ) : (
          <>
            <span>Subscribe</span>
            <ArrowRight className={isLg ? "size-5 md:size-4" : "size-4.5 md:size-3.5"} />
          </>
        )}
      </Button> 
    </form>
  );
}