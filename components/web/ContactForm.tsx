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
      className="space-y-4 max-w-xl mx-auto bg-card p-6 border border-border transition-colors duration-300 ease-in-out"
    >
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1">Name</label>
        <input 
          required 
          name="name" 
          type="text" 
          className="w-full bg-background text-foreground px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-200" 
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-1">Email</label>
        <input 
          required 
          name="email" 
          type="email" 
          className="w-full bg-background text-foreground px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-200" 
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-1">Subject</label>
        <input 
          required 
          name="subject" 
          type="text" 
          className="w-full bg-background text-foreground px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-200" 
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-1">Message</label>
        <textarea 
          required 
          name="message" 
          rows={5} 
          className="w-full bg-background text-foreground px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-colors duration-200" 
        />
      </div>

      <Button type="submit" disabled={isPending} className="w-full font-semibold">
        {isPending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}