"use client";

import React, { useState } from "react";
import { Card } from "../ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import {
  Smile,
  Layers,
  CreditCard,
  Mail,
  MessageCircle,
  PlayCircle,
  LucideIcon,
} from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: React.ReactNode;
  icon: LucideIcon;
}

const allFaqs: FAQItem[] = [
  {
    id: "free-trial",
    question: "Is there a free trial available?",
    icon: Smile,
    answer: (
      <>
        Yes, you can try us for free for 30 days. If you want, we'll provide you with a free
        30-minute onboarding call to get you up and running. Book a call{" "}
        <a href="#" className="underline font-medium hover:text-foreground">
          here
        </a>
        .
      </>
    ),
  },
  {
    id: "change-plan",
    question: "Can I change my plan later?",
    icon: Layers,
    answer: "Yes, you can upgrade, downgrade, or cancel your subscription plan at any time directly from your dashboard settings.",
  },
  {
    id: "cancellation",
    question: "What is your cancellation policy?",
    icon: CreditCard,
    answer: "Our plans are month-to-month. You can cancel at any time and you will retain access to your premium features until the end of your billing cycle.",
  },
  {
    id: "change-email",
    question: "How do I change my account email?",
    icon: Mail,
    answer: "You can change your email address in your Account Settings. For security reasons, you will need to verify the new email address before the change takes effect.",
  },
  {
    id: "support",
    question: "How does support work?",
    icon: MessageCircle,
    answer: "Our support team is available 24/7 via live chat and email. Enterprise tier users also get access to a dedicated Slack channel and phone support.",
  },
  {
    id: "tutorials",
    question: "Do you provide tutorials?",
    icon: PlayCircle,
    answer: "Yes, we have a comprehensive library of video tutorials, step-by-step documentation, and weekly live webinars to help you master the platform.",
  },
];

export default function UnifiedFAQCard() {
  const [showAll, setShowAll] = useState(false);
  const visibleFaqs = showAll ? allFaqs : allFaqs.slice(0, 3);

  return (
    <div className="w-full max-w-4xl mx-auto py-6 md:py-10">
      <style>{`
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <Card 
        className="w-full p-6 md:p-10 flex flex-col items-center bg-card/70 backdrop-blur-md border-border/50 rounded-none shadow-md shadow-black/5 dark:shadow-black/40 transition-all duration-300 ease-out"
        style={{
          animation: `slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
          opacity: 0,
        }}
      >
        <Accordion type="single" collapsible className="w-full space-y-4">
          {visibleFaqs.map((faq) => {
            const Icon = faq.icon;
            return (
              <AccordionItem 
                value={faq.id} 
                key={faq.id}
                className="border-none py-1"
              >
                <AccordionTrigger className="flex items-center gap-4 py-3 hover:no-underline group text-left">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center w-11 h-11 border border-border/80 rounded-xl bg-background shadow-sm shrink-0">
                      <Icon className="w-5 h-5 text-foreground stroke-[1.75]" />
                    </div>
                    <span className="text-base font-semibold tracking-tight text-foreground md:text-lg">
                      {faq.question}
                    </span>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent className="pl-[60px] pr-4 text-sm md:text-base leading-relaxed text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {!showAll && (
          <Button
            onClick={() => setShowAll(true)}
            className="mt-8 px-6 py-5 rounded-full bg-[#0B0F19] text-white hover:bg-[#161B26] text-sm font-medium transition-colors"
          >
            Load more
          </Button>
        )}
      </Card>
    </div>
  );
}