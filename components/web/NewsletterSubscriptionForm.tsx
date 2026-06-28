"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react"; 
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api"; 
import { toast } from "sonner";
import { ArrowRight } from "lucide-react"; 

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
                toast.success("Thank you for subscribing to our updates!");
                setEmail("");
            } else {
                toast.info(message); 
            }
        } catch (error) {
            toast.error("Failed to process subscription. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full items-stretch sm:items-center">
            <Input 
                type="email"
                required
                disabled={isSubmitting}
                placeholder="john@doe.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white dark:bg-background h-12 rounded-md px-3 focus-visible:ring-1 focus-visible:ring-ring transition-colors duration-200"
            />
            
            <Button 
                type="submit" 
                disabled={isSubmitting}
                className="group px-6 py-3.5 bg-foreground hover:bg-foreground/90 text-background font-semibold text-sm rounded-full transition-all duration-200 active:scale-98 inline-flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto shrink-0 cursor-pointer h-12"
            >
                <span>{isSubmitting ? "Joining..." : "Subscribe"}</span>
                {!isSubmitting && (
                    <ArrowRight 
                        className="w-4 h-4 text-background transform transition-transform duration-200 group-hover:translate-x-0.5" 
                        strokeWidth={2.5} 
                    />
                )}
            </Button> 
        </form>
    );
}