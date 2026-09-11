"use client";

import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const titleVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.21, 0.47, 0.32, 0.98],
      staggerChildren: 0.12,
    },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function HeroTitle() {
  return (
    <motion.h1
      variants={titleVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        spaceGrotesk.className,
        "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
        "font-semibold",
        "tracking-tight",
        "leading-tight sm:leading-tight md:leading-tight",
        "max-w-4xl text-center"
      )}
    >
      <motion.span variants={wordVariants} className="text-foreground inline-block">
        Developing{" "}
      </motion.span>{" "}

      <motion.span
        variants={wordVariants}
        className={cn(
          "inline-block bg-gradient-to-r from-emerald-400 via-teal-300 to-green-300 bg-clip-text text-transparent",
          "drop-shadow-[0_0_25px_rgba(52,211,153,0.4)]"
        )}
      >
        effective solutions
      </motion.span>{" "}

      <motion.span variants={wordVariants} className="text-foreground inline-block">
        to{" "}
      </motion.span>{" "}

      <motion.span
        variants={wordVariants}
        className={cn(
          "inline-block bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent",
          "drop-shadow-[0_0_25px_rgba(251,191,36,0.4)]"
        )}
      >
        difficult problems
      </motion.span>
    </motion.h1>
  );
}