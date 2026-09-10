'use client';

import { LucideIcon, Wrench, ChevronsUp, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

interface CardData {
  id: string;
  imageSrc: string;
  imageAlt: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const cardsData: CardData[] = [
  {
    id: "tools",
    imageSrc: "/comp1.png",
    imageAlt: "software",
    icon: Wrench,
    title: "Providing tools that you need.",
    description: "Delivering digital solutions to difficult problems. Pushing the bounds.",
  },
  {
    id: "lean",
    imageSrc: "/comp2.png",
    imageAlt: "process",
    icon: ChevronsUp,
    title: "Staying lean. Doing what others can't.",
    description: "Working with agility. Responding to the market. Out maneuvering enterprises.",
  },
  {
    id: "brain",
    imageSrc: "/comp3.png",
    imageAlt: "brain",
    icon: Zap,
    title: "Innovating where it's desperately desired.",
    description: "Architecturing effective platforms. Addressing novel challenges.",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 24 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    }
  },
};

function VisionCardItem({ card }: { card: CardData }) {
  const Icon = card.icon;

  return (
    <motion.div variants={cardVariants} className="h-full">
      <Card className="flex flex-col justify-between h-full overflow-hidden bg-white/90 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl border border-neutral-200/70 dark:border-neutral-800/80 shadow-md shadow-black/5 dark:shadow-black/40 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/60 transition-all duration-300 ease-out hover:-translate-y-1">
        
        <div className="w-full aspect-[2/1] bg-neutral-50/70 dark:bg-neutral-950/50 flex items-center justify-center relative overflow-hidden group p-4 border-b border-neutral-200/50 dark:border-neutral-800/60 isolate">
          <div className="relative w-full h-full max-w-[80%] max-h-[85%] mx-auto">
            <Image
              src={card.imageSrc}
              alt={card.imageAlt}
              fill
              priority
              className="object-scale-down"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>

        <div className="px-5 pt-3 flex items-center justify-start">
          <div className="p-1.5 bg-neutral-100/90 dark:bg-neutral-800/80 rounded-md text-primary dark:text-foreground border border-neutral-200/50 dark:border-neutral-700/60 shadow-xs">
            <Icon className="w-4 h-4 stroke-[1.5]" />
          </div>
        </div>

        <CardHeader className="flex flex-col gap-1.5 p-5 pt-2.5">
          <CardTitle className="text-lg font-semibold tracking-tight text-foreground leading-snug">
            {card.title}
          </CardTitle>
          <CardContent className="p-0 text-xs md:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {card.description}
          </CardContent>
        </CardHeader>
      </Card>
    </motion.div>
  );
}

export default function VisionCards() {
  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-12 isolate">
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      >
        {cardsData.map((card) => (
          <VisionCardItem key={card.id} card={card} />
        ))}
      </motion.div>
    </section>
  );
}