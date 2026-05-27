import TypewriterEffect from "@/components/web/TypeWriter";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LuBoxes } from "react-icons/lu";
import { IoAccessibility } from "react-icons/io5";
import { LuComputer } from "react-icons/lu";
import { Separator } from "@/components/ui/separator";
import { FaGlobeEurope } from "react-icons/fa";
import { BiSolidServer } from "react-icons/bi";
import { GiArtificialIntelligence } from "react-icons/gi";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { CAROUSEL_ITEMS } from "../constants/carouselItems"

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-cover bg-center bg-no-repeat">
      <div className="mt-30 max-w-7xl mx-auto px-6">
        <div className="mb-60 flex flex-row items-center justify-between w-full gap-12">
          <div className="w-[50%] flex flex-col gap-8 shrink-0">
            <div>
              <TypewriterEffect /> 
            </div>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
              when an unknown printer took a galley of type and scrambled it to make a type 
              specimen book. It has survived not only five centuries, but also the leap into 
              electronic typesetting, remaining essentially unchanged.
            </p>
          </div>

          <div className="flex items-center justify-end flex-1">
            <Link 
              className={cn(
                buttonVariants({ variant: "outline" }), 
                "text-sm font-bold uppercase tracking-wider px-10 py-7 h-auto border-2 gap-4 rounded-none whitespace-nowrap"
              )} 
              href="/products"
            > 
              View products <ArrowRight className="size-3"/>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-15 mb-10 w-full px-12">
        <Carousel>
          <CarouselContent className="ml-1">
            {CAROUSEL_ITEMS.map((item) => {
              const IconComponent = item.icon; 
              
              return (
                <CarouselItem 
                  key={item.id} 
                  className="basis-full md:basis-1/2 lg:basis-1/3 pl-4 py-6 px-3 hover:z-10 transition-all"
                >
                  <Card className="h-[320px] md:h-[380px] lg:h-[450px] overflow-hidden border-2 rounded-none bg-white scale-100 hover:scale-105 transition duration-500 shadow-sm">
                    <CardHeader>
                      <IconComponent className="h-10 w-10" />
                      <CardTitle className="text-2xl">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="h-24 w-12 rounded-none border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground" />
          <CarouselNext className="h-24 w-12 rounded-none border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground" />
        </Carousel>
      </div>

      <div className="mb-15 h-100 grid gap-6 md:grid-cols-2 lg:grid-cols-1">
        <Card className="border-0">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Working with trusted tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center justify-items-center w-full">
              <div className="w-full p-12 aspect-video relative overflow-hidden border-muted">
                <img 
                  src="https://i.postimg.cc/L8zSfkXM/nextjs.jpg" 
                  alt="Tool 1" 
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="w-full p-12 aspect-video relative overflow-hidden border-muted">
                <img 
                  src="https://i.postimg.cc/hv3p7Bcz/typescript-logo-icon-144782.png" 
                  alt="Tool 2" 
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="w-full p-12 aspect-video relative overflow-hidden border-muted">
                <img 
                  src="https://i.postimg.cc/WzjPf0kX/logo-black.png" 
                  alt="Tool 3" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}