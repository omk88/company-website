"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import convexIcon from "./convex.svg";
import nextjsIcon from "./nextjs.svg";
import typescriptIcon from "./typescript.svg";
import vercelIcon from "./vercel.svg";

interface ToolItem {
  name: string;
  icon: any;
  className?: string;
}

const toolSets: ToolItem[][] = [
  [
    { name: "Next.js", icon: nextjsIcon, className: "h-6 sm:h-7 w-auto" },
    { name: "TypeScript", icon: typescriptIcon, className: "h-6 sm:h-7 w-auto" },
  ],
  [
    { name: "Convex", icon: convexIcon, className: "h-6 sm:h-7 w-auto" },
    { name: "Vercel", icon: vercelIcon, className: "h-6 sm:h-7 w-auto" },
  ],
];

export default function TrustedToolsSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % toolSets.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full py-10 bg-transparent flex flex-col items-center justify-center font-sans overflow-hidden">
      <div className="w-full max-w-5xl mx-auto px-4 flex flex-col items-center">
        
        <p className="text-lg sm:text-base text-neutral-500 dark:text-neutral-400 font-normal tracking-tight mb-8 text-center">
          Working with tools <span className="text-neutral-800 dark:text-neutral-200 font-medium">you trust</span>
        </p>

        <div className="relative h-12 w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute flex items-center justify-center gap-10 sm:gap-16 w-full"
            >
              {toolSets[index].map((tool) => (
                <div
                  key={tool.name}
                  className="flex items-center justify-center h-8 grayscale opacity-75 hover:opacity-100 transition-opacity dark:invert"
                >
                  <Image
                    src={tool.icon}
                    alt={`${tool.name} logo`}
                    className={`${tool.className ?? "h-6 sm:h-7 w-auto"} object-contain`}
                  />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}