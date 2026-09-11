"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Compass, Lightbulb, Rocket, Zap } from "lucide-react";

const values = [
  {
    icon: Lightbulb,
    title: "Innovate First",
    description:
      "We spot gaps in current technologies and rapidly build novel solutions, pushing the boundaries of what is possible.",
  },
  {
    icon: Compass,
    title: "Redefine Problems",
    description:
      "We don't just solve problems as given; we rethink the fundamental constraints to discover new approaches.",
  },
  {
    icon: Zap,
    title: "Deep Systems Expertise",
    description:
      "Combining deep technical fundamentals with rapid execution to architect scalable, resilient platforms.",
  },
  {
    icon: Rocket,
    title: "Action-Oriented Design",
    description:
      "We turn complex architectural theories into real-world code that delivers on technology's true promise.",
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

export default function ValuesSection() {
  return (
    <section className="w-full my-16 border-y border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/30">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Our Core Values
          </h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          {values.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "relative group p-6 sm:p-8 rounded-xl",
                  "border border-neutral-200/80 dark:border-neutral-800/80",
                  "bg-background/80 backdrop-blur-sm shadow-xs",
                  "hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700",
                  "transition-all ease-out"
                )}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neutral-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="flex flex-col gap-4 relative z-10">
                  <div className="p-3 w-fit rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 group-hover:scale-105 transition-transform duration-300">
                    <Icon className="w-6 h-6 stroke-[1.75]" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm font-light leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}