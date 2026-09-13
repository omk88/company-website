"use client";

import React, { useState, useEffect, useRef } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import ContactCards from "@/components/web/ContactCards";
import FAQSection from "@/components/web/FrequentlyAskedQuestions";
import { Button } from "@/components/ui/button";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  CircleHelp, 
  Loader2, 
  MessageCircleQuestionMark, 
  Bot, 
  Send 
} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ContactPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const submitContact = useMutation(api.contact.sendMessage);
  const fetchAIResponse = useAction(api.chat.getAIResponse);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isChatLoading]);

  useEffect(() => {
    if (!isChatbotOpen) {
      setChatHistory([]);
    }
  }, [isChatbotOpen]);

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
    <>
      <div className="pt-16 max-w-6xl mx-auto w-full border-x border-neutral-200 dark:border-neutral-800 flex-1">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex-1 flex flex-col justify-end items-center gap-6">
          <div className="text-center space-y-3 max-w-xl shrink-0 flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-gray-200/80 shadow-sm text-sm font-medium text-foreground">
              <MessageCircleQuestionMark className="w-4 h-4 text-foreground" />
              <span>Contact</span>
            </div>

            <div 
              className={cn(
                "relative flex flex-col items-center w-full",
                "text-neutral-600 dark:text-neutral-400",
              )}
            >
              <h1
                className={cn(
                  "pb-2 text-2xl sm:text-3xl md:text-4xl", 
                  "font-semibold tracking-tight text-foreground",
                  "leading-tight max-w-3xl text-center"
                )}
              >
                Get in touch.
              </h1>
              <p className="max-w-lg mx-auto text-center font-light text-xl leading-relaxed">
                Have a question or want to work together? Drop us a message and our team will get back to you shortly.
              </p>
            </div>
          </div>

          <div className="w-full shrink-0">
            <ContactCards 
            />
          </div>
        </div>

        <div 
          className={cn(
            "relative flex flex-col items-center w-full my-12 py-12 px-4",
            "border-y border-neutral-200/80 dark:border-neutral-800/80",
            "text-neutral-600 dark:text-neutral-400",
            "bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#262626_1px,transparent_1px)]",
            "[background-size:16px_16px]"
          )}
        >
          <h2
            className={cn(
              "pb-4 text-2xl sm:text-3xl md:text-4xl", 
              "font-semibold tracking-tight text-foreground",
              "leading-tight max-w-3xl text-center"
            )}
          >
            We're working round the clock to get you the answers you need
          </h2>

          <p className="max-w-lg mx-auto text-center font-light text-xl leading-relaxed">
            Our support team works day and night to answer your questions. If you haven't recieved an answer yet - hang tight! We're moving fast to get you the information you need.
          </p>
        </div>

        <div id="faq-section" className="w-full bg-white dark:bg-zinc-950">
          <div className="max-w-7xl mx-auto px-6 pt-16 pb-24">
            <div className="mb-8 md:mb-6 flex flex-col justify-center md:justify-start gap-2.5 text-foreground">
              <div className="inline-flex w-fit items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-gray-200/80 shadow-sm text-sm font-medium text-foreground">
                <CircleHelp className="w-4 h-4 text-foreground" />
                <span>FAQ</span>
              </div>
              <h3
                className={cn(
                  "text-2xl sm:text-3xl md:text-4xl", 
                  "font-semibold tracking-tight text-foreground",
                  "leading-tight max-w-3xl"
                )}
              >
                Frequently Asked Questions
              </h3>
              <p className="max-w-lg font-light text-xl leading-relaxed">
                Common questions asked by our users about our services.
              </p>
            </div>
            
            <FAQSection 
              onMessageClick={() => setIsSheetOpen(true)} 
              onChatbotClick={() => setIsChatbotOpen(true)} 
            />

          </div>
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
      </div>
    </>
  );
}