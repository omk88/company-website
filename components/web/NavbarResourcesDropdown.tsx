"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Info, Sparkles, HelpCircle, Shield, FileText, Cookie } from "lucide-react";

const mainPages = [
  {
    title: "About",
    description: "Learn more about our vision and who we are.",
    href: "/about",
    icon: Info,
  },
  {
    title: "Solutions",
    description: "View our digital solutions and products.",
    href: "/solutions",
    icon: Sparkles,
  },
  {
    title: "Help & Support",
    description: "Get answers to common questions or reach our support team.",
    href: "/contact",
    icon: HelpCircle,
  },
];

const legalPages = [
  { title: "Privacy Policy", href: "/privacy", icon: Shield },
  { title: "Terms & Conditions", href: "/terms", icon: FileText },
  { title: "Cookie Policy", href: "/cookies", icon: Cookie },
];

export default function NavbarResourcesDropdown() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-medium">
            Resources
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <div className="w-[600px] bg-background/95 backdrop-blur-md overflow-hidden grid grid-cols-12 rounded-xl">
              <div className="col-span-8 p-4">
                <div className="flex flex-col gap-1 relative">
                  {mainPages.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <NavigationMenuLink key={item.title} asChild>
                        <Link
                          href={item.href}
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          className="relative group p-2.5 rounded-lg flex items-start gap-3 transition-colors"
                        >
                          <AnimatePresence>
                            {hoveredIndex === index && (
                              <motion.div
                                layoutId="nav-hover-pill"
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                transition={{ duration: 0.15 }}
                                className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800/70 rounded-lg -z-0"
                              />
                            )}
                          </AnimatePresence>

                          <div className="relative z-10 p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 text-foreground group-hover:scale-105 transition-transform duration-200 shrink-0">
                            <Icon className="w-4 h-4 stroke-[1.75]" />
                          </div>

                          <div className="relative z-10">
                            <div className="text-sm font-medium text-foreground">
                              {item.title}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed mt-0.5 font-light">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    );
                  })}
                </div>
              </div>

              <div className="col-span-4 bg-neutral-50/80 dark:bg-neutral-900/50 p-4 border-l border-neutral-200/60 dark:border-neutral-800/60 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col gap-0.5">
                    {legalPages.map((legal) => {
                      const Icon = legal.icon;
                      return (
                        <NavigationMenuLink key={legal.title} asChild>
                          <Link
                            href={legal.href}
                            className="p-2 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-neutral-200/50 dark:hover:bg-neutral-800/60 flex items-center gap-2 transition-colors"
                          >
                            <Icon className="w-3.5 h-3.5 shrink-0" />
                            <span>{legal.title}</span>
                          </Link>
                        </NavigationMenuLink>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}