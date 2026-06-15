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
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 w-full mt-4">
            <Input 
                type="email"
                required
                disabled={isSubmitting}
                className="bg-background h-12 text-lg w-full" 
                placeholder="Enter your email..." 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Button 
                type="submit" 
                disabled={isSubmitting}
                className="h-12 text-lg px-6 w-full sm:w-auto shrink-0"
            >
                {isSubmitting ? "Joining..." : "Subscribe"}
            </Button> 
        </form>
    );
}