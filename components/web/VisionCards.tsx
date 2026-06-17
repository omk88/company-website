import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import Image from "next/image";

interface CardData {
  id: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
}

function VisionCardItem({ card }: { card: CardData }) {
  return (
    <Card className="flex flex-col justify-between overflow-hidden bg-card/70 backdrop-blur-md border-border/50 rounded-none transition-colors duration-300">
      <div className="w-full aspect-video bg-muted/20 flex items-center justify-center relative overflow-hidden group">
        <Image
          src={card.imageSrc}
          alt={card.imageAlt}
          fill
          priority
          className="object-contain transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardHeader className="pt-4 flex flex-col gap-2">
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
      title: "Providing tools that you need.",
      description: "Delivering digital solutions to difficult problems. Pushing the bounds of what was thought possible.",
    },
    {
      id: "lean",
      imageSrc: "/comp2.png",
      imageAlt: "process",
      title: "Staying lean. Doing what other organisations can't.",
      description: "Working with agility. Responding to the market. Out maneuvering enterprises.",
    },
    {
      id: "brain",
      imageSrc: "/comp3.png",
      imageAlt: "brain",
      title: "Innovating where it's desperately desired.",
      description: "Architecturing effective platforms. Addressing novel challenges with dexterity.",
    },
  ];

  return (
    <div className="w-full py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cardsData.map((card) => (
          <VisionCardItem key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}