"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "../ui/button";
import { FieldGroup, Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ContactFormProps {
  onSuccess?: () => void;
}

export function ContactForm({ onSuccess }: ContactFormProps) {
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
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup className="gap-y-4">
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input 
            required 
            name="name" 
            placeholder="John Doe" 
            type="text" 
          />
        </Field>

        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input 
            required 
            name="email" 
            placeholder="john@doe.com" 
            type="email" 
          />
        </Field>

        <Field>
          <FieldLabel>Subject</FieldLabel>
          <Input 
            required 
            name="subject" 
            placeholder="How can we help?" 
            type="text" 
          />
        </Field>

        <Field>
          <FieldLabel>Message</FieldLabel>
          <textarea 
            required 
            name="message" 
            rows={5}
            placeholder="Leave your message here..."
            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none" 
          />
        </Field>

        <Button type="submit" className="w-full mt-2" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}