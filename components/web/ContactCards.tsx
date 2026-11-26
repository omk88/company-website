"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { HelpCircle, Mail, LucideIcon, Loader2 } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface CardData {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const cardsData: CardData[] = [
  {
    id: "faq",
    icon: HelpCircle,
    title: "Frequently asked questions",
    description:
      "Need more information about what we do? Take a look at our frequently asked questions.",
  },
  {
    id: "contact",
    icon: Mail,
    title: "Send us a message",
    description:
      "Still have a question that needs answering? Send us a message. We're here to help.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.21, 0.47, 0.32, 0.98] as const,
    },
  },
};

export default function ContactCards(){
  
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const submitContact = useMutation(api.contact.sendMessage);

  const handleCardClick = (id: string) => {
    if (id === "contact") {
      setIsSheetOpen(true);
    }
    if (id === "faq") {
      document
        .getElementById("faq-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const data = {
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
    <div className="w-full py-2">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
      >
        {cardsData.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleCardClick(card.id)}
              className={cn(
                "relative group p-6 sm:p-8 rounded-xl cursor-pointer",
                "border border-neutral-200/80 dark:border-neutral-800/80",
                "bg-background/80 backdrop-blur-md shadow-xs",
                "hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700",
                "transition-all ease-out"
              )}
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neutral-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="flex flex-col gap-4 relative z-10 h-full justify-between">
                <div className="flex flex-col gap-4">
                  <div className="p-3 w-fit rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 group-hover:scale-105 transition-transform duration-300">
                    <Icon className="w-6 h-6 stroke-[1.75]" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {card.title}
                    </h3>
                    <p className="text-base font-light leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

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
              <Button type="submit" className="cursor-pointer w-full font-medium" disabled={isPending}>
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
                <Button variant="outline" className="cursor-pointer w-full font-medium" type="button">
                  Close
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}