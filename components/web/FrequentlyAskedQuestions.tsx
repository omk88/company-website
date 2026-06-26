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
      </      >
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
    <div className="w-full">
      <Card className="w-full pt-4 pb-8 flex flex-col items-center bg-white dark:bg-card border-border/50 rounded-none shadow-md shadow-black/5 dark:shadow-black/40 transition-all duration-300 ease-out">
        <div 
          className="w-full"
          style={{
            animation: `slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
            opacity: 0,
          }}
        >
          <Accordion type="single" collapsible className="w-full">
            {visibleFaqs.map((faq) => {
              return (
                <AccordionItem 
                  value={faq.id} 
                  key={faq.id}
                  className="border-b border-border/60 px-6 md:px-10 py-1 transition-colors duration-200 last:border-b-0"
                >
                  <AccordionTrigger className="flex items-center justify-between py-2 hover:no-underline group text-left">
                    <span className="text-base font-semibold tracking-tight text-foreground md:text-lg transition-colors duration-200 group-hover:text-foreground/80">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  
                  <AccordionContent className="text-sm md:text-base leading-relaxed text-muted-foreground pb-5 max-w-3xl">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        {!showAll && (
          <Button
            onClick={() => setShowAll(true)}
            className="mt-2 px-6 py-2 rounded-full bg-[#0B0F19] text-white hover:bg-[#161B26] dark:bg-white dark:text-black dark:hover:bg-white/90 text-sm font-medium transition-colors shadow-xs"
          >
            Load more
          </Button>
        )}
      </Card>
    </div>
  );
}