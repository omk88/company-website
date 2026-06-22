"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ContactForm() {
  const submitContact = useMutation(api.contact.sendMessage);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      await submitContact(data);
      toast.success("Message sent! We will get back to you shortly.");
      (event.target as HTMLFormElement).reset(); 
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-3.5 w-full bg-card/70 backdrop-blur-md p-6 sm:p-8 border border-border/50 rounded-none shadow-md shadow-black/5 dark:shadow-black/40 transition-all duration-300 ease-in-out"
    >
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1 font-mono uppercase tracking-wider text-xs">Name</label>
        <input 
          required 
          name="name" 
          type="text" 
          className="w-full bg-background text-foreground px-3 py-2 border border-input rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-border/80 transition-colors duration-200" 
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-1 font-mono uppercase tracking-wider text-xs">Email</label>
        <input 
          required 
          name="email" 
          type="email" 
          className="w-full bg-background text-foreground px-3 py-2 border border-input rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-border/80 transition-colors duration-200" 
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-1 font-mono uppercase tracking-wider text-xs">Subject</label>
        <input 
          required 
          name="subject" 
          type="text" 
          className="w-full bg-background text-foreground px-3 py-2 border border-input rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-border/80 transition-colors duration-200" 
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-1 font-mono uppercase tracking-wider text-xs">Message</label>
        <textarea 
          required 
          name="message" 
          rows={4}
          className="w-full bg-background text-foreground px-3 py-2 border border-input rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-border/80 resize-none transition-colors duration-200" 
        />
      </div>

      <Button type="submit" disabled={isPending} className="w-full font-semibold rounded-none bg-foreground text-background hover:bg-foreground/90 font-mono uppercase tracking-wider text-xs h-11 mt-2">
        {isPending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}