"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react"; 
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api"; 
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react"; 

export default function NewsletterSubscriptionForm() {
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

  return (
    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 w-full sm:w-80">
      <Input 
        type="email"
        required
        disabled={isSubmitting}
        placeholder="Enter your email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-white dark:bg-zinc-950 h-10 rounded-lg px-3 text-sm border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-400"
      />
      
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="h-10 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 text-xs font-semibold rounded-lg shrink-0 gap-2"
      >
        {isSubmitting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <>
            <span>Subscribe</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </>
        )}
      </Button> 
    </form>
  );
}