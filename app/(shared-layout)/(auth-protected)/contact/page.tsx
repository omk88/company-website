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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import GridCube from "@/components/3d/GridCube";

const CONTACT_MODELS = ['/pipes.glb'];

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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput("");

    const updatedHistory: ChatMessage[] = [...chatHistory, { role: "user", content: userMsg }];
    setChatHistory(updatedHistory);
    setIsChatLoading(true);

    try {
      const aiReply = await fetchAIResponse({ history: updatedHistory });
      setChatHistory([...updatedHistory, { role: "assistant", content: aiReply }]);
    } catch (error) {
      toast.error("The assistant is experiencing connectivity issues. Please try again.");
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <>
      <section className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-4 pb-16 flex flex-col items-center h-[calc(100vh-64px)] justify-start overflow-hidden">
        <div className="flex flex-col items-center w-full flex-1 justify-start gap-4 md:gap-6">
          
          <div className="w-full h-30 max-w-md lg:max-w-[460px] flex items-center justify-center relative overflow-hidden shrink-0 transform-gpu">
            <GridCube models={CONTACT_MODELS} storageKey="contact_sphere_path" glitchEnabled={false} />
          </div>

          <div className="w-full flex flex-col items-center gap-6 -mt-2 md:-mt-4">
            <div className="text-center space-y-1.5 max-w-xl shrink-0">
              <h1 className="flex items-center justify-center gap-2.5 font-bold text-xl md:text-2xl text-foreground tracking-tight">
                <MessageCircleQuestionMark className="w-5 h-5 md:w-6 md:h-6 stroke-[2.3] shrink-0" />
                <span>Get in touch.</span>
              </h1>
              <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto leading-normal">
                Have a question or want to work together? Drop us a message and our team will get back to you shortly.
              </p>
            </div>
            
            <div className="w-full shrink-0">
              <ContactCards 
                onMessageClick={() => setIsSheetOpen(true)} 
                onChatbotClick={() => setIsChatbotOpen(true)}
              />
            </div>
          </div>

        </div>
      </section>

      <div id="faq-section" className="w-full max-w-7xl mx-auto px-6 pt-8 pb-24">
        <div className="mb-8 md:mb-6 flex items-center justify-center md:justify-start gap-2.5 text-foreground">
          <CircleHelp className="w-5 h-5 md:w-6 md:h-6 stroke-[2.3] shrink-0" />
          <h2 className="font-bold text-xl md:text-2xl tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>
        
        <FAQSection 
          onMessageClick={() => setIsSheetOpen(true)} 
          onChatbotClick={() => setIsChatbotOpen(true)} 
        />
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

      <Dialog open={isChatbotOpen} onOpenChange={setIsChatbotOpen}>
        <DialogContent className="sm:max-w-[500px] h-[550px] flex flex-col p-0 overflow-hidden">
          
          <DialogHeader className="p-6 pb-4 border-b border-border/50 shrink-0">
            <DialogTitle className="text-lg font-semibold tracking-tight flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              AI Assistant
            </DialogTitle>
            <DialogDescription>
              Ask our chatbot anything about our services and products.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/10">
            {chatHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-1 text-center px-4">
                <Bot className="h-8 w-8 stroke-[1.2] text-muted-foreground/50 mb-1" />
                <p className="text-sm font-medium">Hello! How can I help you today?</p>
              </div>
            ) : (
              chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2.5 w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="p-1 bg-primary/10 rounded-md shrink-0 text-primary mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-lg px-3.5 py-2 text-sm shadow-xs ${
                      msg.role === "user"
                        ? "bg-[#0B0F19] text-white dark:bg-white dark:text-black rounded-tr-none"
                        : "bg-white dark:bg-card border border-border/60 text-foreground rounded-tl-none"
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            
            {isChatLoading && (
              <div className="flex items-start gap-2.5 w-full justify-start">
                <div className="p-1 bg-primary/10 rounded-md shrink-0 text-primary mt-0.5 animate-pulse">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white dark:bg-card border border-border/60 text-muted-foreground rounded-lg rounded-tl-none px-4 py-2 text-xs flex items-center gap-1.5">
                  <Loader2 className="h-3 w-3 animate-spin text-primary" />
                  Assistant is compiling answer...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form 
            onSubmit={handleSendMessage} 
            className="p-4 border-t border-border/50 flex items-center gap-2 bg-white dark:bg-card shrink-0"
          >
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your message here..."
              disabled={isChatLoading}
              className="flex-1 h-10 border-border/60 focus-visible:ring-1 focus-visible:ring-primary shadow-none bg-transparent"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isChatLoading || !chatInput.trim()} 
              className="h-10 w-10 shrink-0 cursor-pointer bg-[#0B0F19] text-white hover:bg-[#161B26] dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          
        </DialogContent>
      </Dialog>
    </>
  );
}