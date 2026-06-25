"use client";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { HelpCircle, MessageSquare, Mail, LucideIcon } from "lucide-react";

interface CardData {
  id: string;
  icon: LucideIcon; 
  title: string;
  description: string;
}

interface ContactCardItemProps {
  card: CardData;
  index: number;
  onCardClick?: (id: string) => void;
}

function ContactCardItem({ card, index, onCardClick }: ContactCardItemProps) {
  const Icon = card.icon;

  return (
    <Card 
      onClick={() => onCardClick?.(card.id)}
      className="flex flex-col justify-between overflow-hidden bg-card/70 backdrop-blur-md border-border/50 rounded-none shadow-md shadow-black/5 dark:shadow-black/40 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/60 transition-all duration-300 ease-out hover:-translate-y-1 cursor-pointer"
      style={{
        animation: `slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
        animationDelay: `${index * 120}ms`,
        opacity: 0,
      }}
    >
      <div className="pt-4 px-5 flex items-center justify-start">
        <div className="p-1.5 bg-muted/40 rounded-md text-primary dark:text-foreground">
          <Icon className="w-5 h-5 stroke-[1.5]" />
        </div>
      </div>

      <CardHeader className="pt-0 px-5 pb-5 flex flex-col gap-2">
        <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
          {card.title}
        </CardTitle>
        <CardContent className="p-0 text-sm md:text-base leading-relaxed text-muted-foreground">
          {card.description}
        </CardContent>
      </CardHeader>
    </Card>
  );
}

interface ContactCardsProps {
  onMessageClick?: () => void;
}

export default function ContactCards({ onMessageClick }: ContactCardsProps) {
  const cardsData: CardData[] = [
    {
      id: "faq",
      icon: HelpCircle,
      title: "Frequently asked questions",
      description: "Need more information about what we do? Take a look at our frequently asked questions.",
    },
    {
      id: "chatbot",
      icon: MessageSquare,
      title: "Talk with our chatbot",
      description: "Harness the power of AI to get the answers you need.",
    },
    {
      id: "contact",
      icon: Mail,
      title: "Send us a message",
      description: "Still have a question that needs answering? Send us a message. We're here to help.",
    },
  ];

  const handleCardClick = (id: string) => {
    if (id === "contact" && onMessageClick) {
      onMessageClick();
    }
    if (id === "faq") {
      document.getElementById("faq-section")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full py-2">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cardsData.map((card, index) => (
          <ContactCardItem 
            key={card.id} 
            card={card} 
            index={index} 
            onCardClick={handleCardClick}
          />
        ))}
      </div>
    </div>
  );
}