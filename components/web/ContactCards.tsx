"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { HelpCircle, MessageSquare, Mail, LucideIcon } from "lucide-react";

interface CardData {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

interface ContactCardsProps {
  onMessageClick?: () => void;
  onChatbotClick?: () => void;
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
    id: "chatbot",
    icon: MessageSquare,
    title: "Talk with our chatbot",
    description: "Harness the power of AI to get the answers you need.",
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

export default function ContactCards({
  onMessageClick,
  onChatbotClick,
}: ContactCardsProps) {
  const handleCardClick = (id: string) => {
    if (id === "contact" && onMessageClick) {
      onMessageClick();
    }
    if (id === "chatbot" && onChatbotClick) {
      onChatbotClick();
    }
    if (id === "faq") {
      document
        .getElementById("faq-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full py-2">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
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
              {/* Subtle gradient hover layer */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neutral-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="flex flex-col gap-4 relative z-10 h-full justify-between">
                <div className="flex flex-col gap-4">
                  {/* Matching Icon Badge */}
                  <div className="p-3 w-fit rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 group-hover:scale-105 transition-transform duration-300">
                    <Icon className="w-6 h-6 stroke-[1.75]" />
                  </div>

                  {/* Text Content */}
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
    </div>
  );
}