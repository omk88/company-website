"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Crosshair, Eye, Handshake, Heart, Lightbulb } from "lucide-react";

const values = [
  {
    icon: Lightbulb,
    title: "Innovation First",
    description:
      "We don't consider ourselves to be an average software company. At TaQtiQ, we want to redefine problems, challenge existing thinking and pioneer new paradigms in computing.",
  },
  {
    icon: Handshake,
    title: "Community Collaboration",
    description:
      "Our community is the backbone of our business. We unite developers, clients, and industry partners in a trusted ecosystem, leveraging our collective insight to tackle hard technical problems and open up meaningful new horizons for the world through software.",
  },
  {
    icon: Crosshair,
    title: "Outcome-Oriented Design",
    description:
      "We measure success by real world impact and the ability to get things done. With laser focus on our goals, we build bridges to transformative outcomes.",
  },
  {
    icon: Eye,
    title: "Uncompromising Transparency",
    description:
      "Trust is built on openness and honesty. From clear communication to straightforward roadmaps, we cut through the noise to ensure that no one is left in the dark.",
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
    <section 
      className={cn(
        "relative overflow-hidden w-full my-16 py-12 px-4 sm:px-8 lg:px-12",
        "border-y border-neutral-200/80 dark:border-neutral-800/80",
        "bg-background text-foreground"
      )}
    >
      <div 
        className={cn(
          "absolute inset-0 pointer-events-none opacity-40 dark:opacity-30",
          "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]",
          "bg-[size:24px_24px]"
        )} 
      />

      <div className="relative z-10 w-full mx-auto">

        <div className="flex flex-col gap-2 items-center">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Our Core Values
            </h2>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto"
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
                  "bg-background/80 backdrop-blur-md shadow-xs",
                  "hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700",
                  "transition-all ease-out flex flex-col justify-between"
                )}
              >
                <div className="flex flex-col gap-4 relative z-10">
                  {/* Themed Icon Container */}
                  <div 
                    style={{ 
                      backgroundColor: 'color-mix(in srgb, var(--accent-primary) 12%, transparent)',
                      color: 'var(--accent-primary)'
                    }}
                    className="p-3 w-fit rounded-lg group-hover:scale-105 transition-transform duration-300"
                  >
                    <Icon className="w-6 h-6 stroke-[1.75]" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-base font-light leading-relaxed text-neutral-600 dark:text-neutral-400">
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