"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react"; 
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api"; 
import { toast } from "sonner";

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
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full mt-4">
            <Input 
                type="email"
                required
                disabled={isSubmitting}
                className="bg-background h-12 text-sm w-full rounded-full border border-input px-5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border/80 transition-colors duration-200" 
                placeholder="Enter your email..." 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            
            <Button 
                type="submit" 
                disabled={isSubmitting}
                className="group h-12 px-6 bg-foreground hover:bg-foreground/90 text-background font-semibold text-sm rounded-full transition-all duration-200 active:scale-98 inline-flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto shrink-0"
            >
                <span>{isSubmitting ? "Joining..." : "Subscribe"}</span>
                {!isSubmitting && (
                    <svg 
                        className="w-3 h-3 text-background transform group-hover:translate-x-0.5 transition-transform duration-200" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor" 
                        strokeWidth={4}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                )}
            </Button> 
        </form>
    );
}