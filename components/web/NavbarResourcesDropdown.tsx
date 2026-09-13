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
import { Info, Sparkles, HelpCircle, Shield, FileText, Cookie, Layers } from "lucide-react";

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
    icon: Layers,
  },
  {
    title: "Help & Support",
    description: "Get answers to common questions or reach our support team.",
    href: "/contact",
    icon: HelpCircle,
  },
];

const legalPages = [
  { title: "Privacy Policy", href: "/privacy-policy", icon: Shield },
  { title: "Terms & Conditions", href: "/terms-and-conditions", icon: FileText },
  { title: "Cookie Policy", href: "/cookie-policy", icon: Cookie },
];

interface NavbarResourcesDropdownProps {
  hoveredPath: string | null;
  setHoveredPath: (path: string | null) => void;
}

export default function NavbarResourcesDropdown({
  hoveredPath,
  setHoveredPath,
}: NavbarResourcesDropdownProps) {
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const isTriggerHovered = hoveredPath === "/resources";

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            onMouseEnter={() => setHoveredPath("/resources")}
            className="relative h-auto px-3 py-1.5 text-sm font-medium rounded-lg text-foreground bg-transparent hover:bg-transparent data-[state=open]:bg-transparent focus:bg-transparent transition-colors shadow-none"
          >
            {isTriggerHovered && (
              <motion.div
                layoutId="navbar-pill"
                className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 rounded-lg -z-10"
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 30,
                }}
              />
            )}
            <span className="relative z-10 cursor-pointer">Resources</span>
          </NavigationMenuTrigger>

          <NavigationMenuContent className="p-0 overflow-hidden shadow-xl rounded-xl">
            <div className="w-[580px] grid grid-cols-12 bg-background">
              
              <div className="col-span-7 p-3">
                <div className="flex flex-col gap-0.5 relative">
                  {mainPages.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <NavigationMenuLink key={item.title} asChild>
                        <Link
                          href={item.href}
                          onMouseEnter={() => setHoveredCardIndex(index)}
                          onMouseLeave={() => setHoveredCardIndex(null)}
                          className="relative group p-2.5 rounded-lg flex items-start gap-3 transition-colors"
                        >
                          <AnimatePresence>
                            {hoveredCardIndex === index && (
                              <motion.div
                                layoutId="dropdown-item-pill"
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

              <div className="col-span-5 bg-neutral-50/80 dark:bg-neutral-900/50 p-3 border-l border-neutral-200/60 dark:border-neutral-800/60 flex flex-col justify-between">
                <div className="flex flex-col gap-0.5">
                  {legalPages.map((legal) => {
                    const Icon = legal.icon;
                    return (
                      <NavigationMenuLink key={legal.title} asChild>
                        <Link
                          href={legal.href}
                          className="p-2.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-neutral-200/50 dark:hover:bg-neutral-800/60 flex items-center gap-2 transition-colors"
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
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}