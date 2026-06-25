"use client";

import { useState } from "react";
import ContactCards from "@/components/web/ContactCards";
import FAQSection from "@/components/web/FrequentlyAskedQuestions";
import { ContactForm } from "@/components/web/ContactForm";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function ContactPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 pb-12 min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col gap-6 md:gap-8 w-full mt-6 md:mt-10">
        <div className="flex flex-col text-center md:text-left max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-4 font-sans">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed font-mono">
            Have a question or want to work together? Drop us a message and our team will get back to you shortly.
          </p>
        </div>

        <div className="w-full">
          <ContactCards onMessageClick={() => setIsSheetOpen(true)} />
        </div>

        <div id="faq-section" className="w-full">
          <FAQSection />
        </div>

      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent 
          side="right" 
          className="w-full sm:max-w-md bg-card/95 backdrop-blur-md p-6 sm:p-8"
          >
          <SheetHeader className="mb-6 text-left">
            <SheetTitle className="text-2xl font-extrabold tracking-tight text-foreground font-sans">
              Send us a Message
            </SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground mt-1">
              Fill out the form fields below and we will reach back to you shortly.
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-4">
            <ContactForm onSuccess={() => setIsSheetOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}