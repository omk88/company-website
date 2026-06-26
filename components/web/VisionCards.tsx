import { LucideIcon, Wrench, ChevronsUp, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import Image from "next/image";

interface CardData {
  id: string;
  imageSrc: string;
  imageAlt: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

function VisionCardItem({ card, index }: { card: CardData; index: number }) {
  const Icon = card.icon;
  
  return (
    <Card 
      className="flex flex-col justify-between overflow-hidden bg-card/70 backdrop-blur-md border-border/50 rounded-none shadow-md shadow-black/5 dark:shadow-black/40 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/60 transition-all duration-300 ease-out hover:-translate-y-1"
      style={{
        animation: `slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
        animationDelay: `${index * 120}ms`,
        opacity: 0,
      }}
    >
      <div className="w-full aspect-video bg-muted/20 flex items-center justify-center relative overflow-hidden group p-6">
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

      <div className="px-5 flex items-center justify-start">
        <div className="p-1.5 bg-muted/40 rounded-md text-primary dark:text-foreground">
          <Icon className="w-5 h-5 stroke-[1.5]" />
        </div>
      </div>

      <CardHeader className="flex flex-col gap-2">
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

export default function VisionCards() {
  const cardsData: CardData[] = [
    {
      id: "tools",
      imageSrc: "/comp1.png",
      imageAlt: "software",
      icon: Wrench,
      title: "Providing tools that you need.",
      description: "Delivering digital solutions to difficult problems. Pushing the bounds of what was thought possible.",
    },
    {
      id: "lean",
      imageSrc: "/comp2.png",
      imageAlt: "process",
      icon: ChevronsUp,
      title: "Staying lean. Doing what other organisations can't.",
      description: "Working with agility. Responding to the market. Out maneuvering enterprises.",
    },
    {
      id: "brain",
      imageSrc: "/comp3.png",
      imageAlt: "brain",
      icon: Zap,
      title: "Innovating where it's desperately desired.",
      description: "Architecturing effective platforms. Addressing novel challenges with dexterity.",
    },
  ];

  return (
    <div className="w-full py-2 md:py-2">
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
          <VisionCardItem key={card.id} card={card} index={index} />
        ))}
      </div>
    </div>
  );
}