"use client";

import React, { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Smile,
  Layers,
  CreditCard,
  BadgeDollarSign,
  HandCoins,
  HeartHandshake,
  Timer,
  Search,
  X, // Imported X icon for the clear functionality
  Frown,
  LucideIcon,
} from "lucide-react";

interface FAQItem {
  id: string;
  category: "pricing" | "support";
  question: string;
  answer: React.ReactNode;
  icon: LucideIcon;
}

const allFaqs: FAQItem[] = [
  {
    id: "free-trial",
    category: "pricing",
    question: "Are there free trials available for your products?",
    icon: Smile,
    answer: (
      <>
        Yes, there are free 14-day trials available for all of our products that have monthly subscriptions. To get a free trial, navigate to the page for the individual product you are interested in.
      </>
    ),
  },
  {
    id: "change-plan",
    category: "pricing",
    question: "Can I change my plan later for any of your products?",
    icon: Layers,
    answer: "Yes, you can upgrade, downgrade, or cancel your subscription plan at any time directly from the settings section of the product you are using.",
  },
  {
    id: "cancellation",
    category: "pricing",
    question: "What is your cancellation policy?",
    icon: CreditCard,
    answer: "Our plans are month-to-month. You can cancel at any time and you will retain access to your premium features until the end of your billing cycle.",
  },
  {
    id: "annual-discounts",
    category: "pricing",
    question: "Do you offer annual discounts for your products?",
    icon: BadgeDollarSign,
    answer: "Yes, all products are discounted if you purchase an annual subscription.",
  },
  {
    id: "hidden-fees",
    category: "pricing",
    question: "Are there any hidden fees or setup costs?",
    icon: HandCoins,
    answer: "No! All fees are explicity stated when purchasing any of our services!",
  },
  {
    id: "support",
    category: "support",
    question: "What kind of support do you provide?",
    icon: HeartHandshake,
    answer: (
      <>
        We are working 24/7 to get you the best experience with our services. If you need support for a product you've purchased or need help with something specific - get in touch through our <a href="#" className="underline">contact page</a> and we'll get back to you ASAP!
      </>
    ),
  },
  {
    id: "response-time",
    category: "support",
    question: "What are your typical response times?",
    icon: Timer,
    answer: (
      <>
        We aim to respond to every enquiry within 72 hours. If this timeframe has passed and you still haven't got a response - hang tight! We are most likely answering other questions and will get to yours in due course.
      </>
    ),
  },
];

export default function UnifiedFAQCard() {
  const [activeTab, setActiveTab] = useState("pricing");
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const pricingMatches = allFaqs.filter(
    (faq) =>
      faq.category === "pricing" &&
      faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const supportMatches = allFaqs.filter(
    (faq) =>
      faq.category === "support" &&
      faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      if (activeTab === "pricing" && pricingMatches.length === 0 && supportMatches.length > 0) {
        setActiveTab("support");
      } else if (activeTab === "support" && supportMatches.length === 0 && pricingMatches.length > 0) {
        setActiveTab("pricing");
      }
    }
  }, [searchQuery, pricingMatches.length, supportMatches.length, activeTab]);

  const filteredFaqs = activeTab === "pricing" ? pricingMatches : supportMatches;
  const visibleFaqs = showAll ? filteredFaqs : filteredFaqs.slice(0, 3);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setShowAll(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowAll(false);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      
      <div className="w-full grid grid-cols-1 md:grid-cols-3 items-center gap-6 mb-6">
        
        <div className="hidden md:block" />

        <div className="w-full max-w-md mx-auto justify-self-center flex justify-center">
          <TabsList className="flex w-auto gap-1 p-1">
            <TabsTrigger value="pricing" className="flex items-center gap-1.5 px-4">
              <span>Plans & Pricing</span>
              <span className="text-xs font-mono text-muted-foreground/60 font-normal">
                {pricingMatches.length}
              </span>
            </TabsTrigger>
            
            <TabsTrigger value="support" className="flex items-center gap-1.5 px-4">
              <span>Product & Support</span>
              <span className="text-xs font-mono text-muted-foreground/60 font-normal">
                {supportMatches.length}
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="relative w-full max-w-xs md:justify-self-end">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground stroke-[1.5]" />
          <Input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowAll(true);
            }}
            className="pl-10 pr-9 h-10 bg-white dark:bg-card border-border/50 rounded-md shadow-xs focus-visible:ring-1 focus-visible:ring-primary"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-150 p-0.5 rounded-sm hover:bg-muted"
            >
              <X className="h-4 w-4 stroke-[2]" />
            </button>
          )}
        </div>
      </div>

      <Card className="w-full pt-4 pb-8 flex flex-col items-center bg-white dark:bg-card border-border/50 rounded-none shadow-md shadow-black/5 dark:shadow-black/40 transition-all duration-300 ease-out">
        <div 
          className="w-full"
          style={{
            animation: `slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
            opacity: 0,
          }}
        >
          {filteredFaqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {visibleFaqs.map((faq: FAQItem) => {
                return (
                  <AccordionItem 
                    value={faq.id} 
                    key={faq.id}
                    className="border-b border-border/60 px-6 md:px-10 py-1 transition-colors duration-200 last:border-b-0"
                  >
                    <AccordionTrigger className="flex items-start justify-between py-4 hover:no-underline group text-left">
                      <div className="flex items-start gap-4">
                        <div className="p-1.5 bg-muted/40 rounded-md text-primary dark:text-foreground shrink-0 mt-0.5">
                          <faq.icon className="w-5 h-5 stroke-[1.5]" />
                        </div>
                        <span className="text-base font-semibold tracking-tight text-foreground md:text-lg transition-colors duration-200 group-hover:text-foreground/80 pt-1">
                          {faq.question}
                        </span>
                      </div>
                    </AccordionTrigger>
                    
                    <AccordionContent className="text-sm md:text-base leading-relaxed text-muted-foreground pb-5 max-w-3xl">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          ) : (
            <div className="w-full py-12 flex flex-col items-center justify-center text-muted-foreground gap-2">
              <Frown className="h-8 w-8 stroke-[1.2] text-muted-foreground/70" />
              <p className="text-sm font-medium">No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>

        {!showAll && filteredFaqs.length > 3 && (
          <Button
            onClick={() => setShowAll(true)}
            className="mt-6 px-6 py-2 rounded-full bg-[#0B0F19] text-white hover:bg-[#161B26] dark:bg-white dark:text-black dark:hover:bg-white/90 text-sm font-medium transition-colors shadow-xs"
          >
            Load more
          </Button>
        )}
      </Card>
    </Tabs>
  );
}