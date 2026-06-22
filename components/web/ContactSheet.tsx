"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ContactForm } from "./ContactForm";

export function ContactSheet() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="font-semibold rounded-none bg-foreground text-background hover:bg-foreground/90 font-mono uppercase tracking-wider text-xs h-11 px-6">
          Get in Touch
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full sm:max-w-md border-l border-border bg-card/95 backdrop-blur-md p-6 sm:p-8">
        <SheetHeader className="mb-6 text-left">
          <SheetTitle className="text-2xl font-extrabold tracking-tight text-foreground font-sans">
            Get in Touch
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground font-mono mt-1">
            Have a question or want to work together? Drop us a line below.
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-4">
          <ContactForm onSuccess={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}