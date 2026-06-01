"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react"; 
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api"; 
import { toast } from "sonner";

export function NewsletterCard() {
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
        <div className="w-full bg-muted flex flex-col md:flex-row justify-between p-8 gap-8">
            <div className="flex-1 max-w-xl flex flex-col gap-4">
                <div>
                    <p className="text-lg text-muted-foreground uppercase tracking-wider mb-2">insights</p>
                    <h1 className="text-3xl font-bold leading-tight text-foreground">
                        Newsletter. Stay up to date.
                    </h1>
                </div>
                
                <form onSubmit={handleSubscribe} className="flex gap-2 w-full mt-4">
                    <Input 
                        type="email"
                        required
                        disabled={isSubmitting}
                        className="bg-background h-12 text-lg" 
                        placeholder="Enter your email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="h-12 text-lg px-6"
                    >
                        {isSubmitting ? "Joining..." : "Subscribe"}
                    </Button> 
                </form>
            </div>

            <div className="flex-1 max-w-sm md:pt-10"> 
                <p className="text-xl text-muted-foreground leading-relaxed">
                    Subscribe to learn more about our latest insights, news and product launches
                </p>
            </div>
        </div>
    );
}