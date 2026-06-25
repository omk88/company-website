"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import ContactCards from "@/components/web/ContactCards";
import FAQSection from "@/components/web/FrequentlyAskedQuestions";
import { Button } from "@/components/ui/button";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import GridCube from "@/components/3d/GridCube";

const CONTACT_MODELS = ['/sphere.glb']

export default function ContactPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
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
      setIsSheetOpen(false);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-4 pb-16 flex flex-col items-center">
      
      <div className="w-full h-24 max-w-md lg:max-w-[460px] flex items-center justify-center relative overflow-hidden">
        <GridCube models={CONTACT_MODELS} storageKey="contact_sphere_path" />
      </div>

      <div className="flex flex-col items-center pb-4 w-full mt-4">
        <div className="py-2 pb-6 text-center space-y-1">
          <h1 className="font-bold text-xl md:text-2xl text-foreground tracking-tight">
            Get in touch.
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto leading-normal">
            Have a question or want to work together? Drop us a message and our team will get back to you shortly.
          </p>
        </div>
        
        <div className="w-full mb-2">
          <ContactCards onMessageClick={() => setIsSheetOpen(true)} />
        </div>
      </div>
      
      <div id="faq-section" className="w-full pt-20 md:pt-28">
        <div className="mb-8 md:mb-12 text-center md:text-left">
          <h2 className="font-bold text-xl md:text-2xl text-foreground tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>
        <FAQSection />
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md bg-card flex flex-col h-full gap-0 overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="flex flex-col h-full w-full">
            <SheetHeader className="text-left shrink-0 p-6 pb-0 space-y-1">
              <SheetTitle className="text-lg font-semibold tracking-tight text-foreground font-sans leading-none">
                Send us a Message
              </SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground font-sans leading-snug tracking-normal">
                Fill out the form fields below and we will get back to you shortly.
              </SheetDescription>
            </SheetHeader>

            <div className="p-6 flex-1 w-full overflow-y-auto">
              <FieldGroup className="gap-y-4">
                <Field>
                  <FieldLabel>Name</FieldLabel>
                  <Input required name="name" placeholder="John Doe" type="text" />
                </Field>

                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input required name="email" placeholder="john@doe.com" type="email" />
                </Field>

                <Field>
                  <FieldLabel>Subject</FieldLabel>
                  <Input required name="subject" placeholder="How can we help?" type="text" />
                </Field>

                <Field>
                  <FieldLabel>Message</FieldLabel>
                  <textarea
                    required
                    name="message"
                    rows={4}
                    placeholder="Leave your message here..."
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
                  />
                </Field>
              </FieldGroup>
            </div>

            <SheetFooter className="shrink-0 p-6 pt-4 flex flex-col gap-2 sm:flex-col mt-auto">
              <Button type="submit" className="w-full font-medium" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
              <SheetClose asChild>
                <Button variant="outline" className="w-full font-medium" type="button">
                  Close
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </section>
  );
}