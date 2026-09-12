"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, ChevronsUp, Zap, Check, Sparkles, Code2, ShieldCheck } from "lucide-react";

// Code snippets for Card 1
const codeExamples = [
  {
    type: "REST & GraphQL",
    code: `const user = await api.get("/user");\nreturn user.hasAccess;`,
  },
  {
    type: "Database Schema",
    code: `SELECT * FROM users\nWHERE status = 'active';`,
  },
];

export default function RedesignedVisionCards() {
  // Card 1 state cycle
  const [codeIndex, setCodeIndex] = useState(0);

  // Card 3 step state cycle (0: prompt typing, 1: rendering UI)
  const [aiStep, setAiStep] = useState(0);

  useEffect(() => {
    // Card 1 loop (4s)
    const codeTimer = setInterval(() => {
      setCodeIndex((prev) => (prev + 1) % codeExamples.length);
    }, 4000);

    // Card 3 loop (3.5s)
    const aiTimer = setInterval(() => {
      setAiStep((prev) => (prev === 0 ? 1 : 0));
    }, 3500);

    return () => {
      clearInterval(codeTimer);
      clearInterval(aiTimer);
    };
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-4 font-sans">
      
      {/* Card 1: Developer Suite */}
      <div className="w-full rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4 text-neutral-800 dark:text-neutral-200 font-semibold text-sm">
            <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800">
              <Wrench className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
            </div>
            <span>Developer Suite</span>
          </div>

          <div className="relative h-56 rounded-2xl bg-neutral-900 p-4 flex flex-col justify-between border border-neutral-800 overflow-hidden font-mono text-xs">
            <div className="flex items-center justify-between text-neutral-400 border-b border-neutral-800 pb-2">
              <span className="flex items-center gap-1.5 text-[11px] text-neutral-300">
                <Code2 className="w-3.5 h-3.5 text-blue-400" />
                {codeExamples[codeIndex].type}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" /> Ready
              </span>
            </div>

            <div className="my-auto">
              <AnimatePresence mode="wait">
                <motion.pre
                  key={codeIndex}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="text-neutral-300 leading-relaxed text-[11px]"
                >
                  <code>{codeExamples[codeIndex].code}</code>
                </motion.pre>
              </AnimatePresence>
            </div>

            <div className="flex justify-between items-center text-[10px] text-neutral-500 pt-2 border-t border-neutral-800/60">
              <span>Type-Safe Integration</span>
              <span>200 OK</span>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 leading-snug">
            Providing tools that you need.
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Delivering digital solutions to difficult problems. Pushing the bounds of the possible.
          </p>
        </div>
      </div>

      {/* Card 2: Performance Agility */}
      <div className="w-full rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4 text-neutral-800 dark:text-neutral-200 font-semibold text-sm">
            <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800">
              <ChevronsUp className="w-4 h-4 text-emerald-500" />
            </div>
            <span>Performance Agility</span>
          </div>

          <div className="relative h-56 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 p-4 flex flex-col justify-center space-y-5 border border-neutral-100 dark:border-neutral-800/50">
            {/* Modern Fast Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                <span>Modern Stack</span>
                <span className="text-emerald-500 font-mono text-[11px] flex items-center gap-1">
                  <Check className="w-3 h-3" /> 0.2s
                </span>
              </div>
              <div className="h-2.5 w-full bg-neutral-200/60 dark:bg-neutral-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500 rounded-full"
                  animate={{ width: ["0%", "100%", "100%", "0%"] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    times: [0, 0.2, 0.8, 1],
                    ease: "easeInOut",
                  }}
                />
              </div>
            </div>

            {/* Legacy Slow Bar */}
            <div className="space-y-1.5 opacity-50">
              <div className="flex justify-between text-xs text-neutral-500">
                <span>Traditional Setup</span>
                <span className="font-mono text-[11px]">3.8s</span>
              </div>
              <div className="h-2.5 w-full bg-neutral-200/60 dark:bg-neutral-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-neutral-400 dark:bg-neutral-600 rounded-full"
                  animate={{ width: ["0%", "30%", "30%", "0%"] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    times: [0, 0.8, 0.9, 1],
                    ease: "linear",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 leading-snug">
            Staying lean. Doing what others can't.
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Working with agility. Responding to the market. Out maneuvering enterprises.
          </p>
        </div>
      </div>

      {/* Card 3: Next-Gen Systems */}
      <div className="w-full rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4 text-neutral-800 dark:text-neutral-200 font-semibold text-sm">
            <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800">
              <Zap className="w-4 h-4 text-purple-500" />
            </div>
            <span>Next-Gen Systems</span>
          </div>

          <div className="relative h-56 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 p-4 flex flex-col justify-between border border-neutral-100 dark:border-neutral-800/50">
            {/* Input Prompt Box */}
            <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 p-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm text-xs text-neutral-600 dark:text-neutral-300">
              <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <span className="font-mono text-[11px] truncate">
                {aiStep === 0 ? "Prompt: Build login form..." : "Generating UI components..."}
              </span>
            </div>

            {/* Generated UI Elements Output */}
            <div className="space-y-2 my-auto">
              <AnimatePresence mode="wait">
                {aiStep === 1 ? (
                  <motion.div
                    key="rendered-ui"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2 bg-white/60 dark:bg-neutral-900/60 p-3 rounded-xl border border-neutral-200/50 dark:border-neutral-800/50"
                  >
                    <div className="h-3 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded" />
                    <div className="h-6 w-full bg-neutral-100 dark:bg-neutral-800/80 rounded-md border border-neutral-200/60 dark:border-neutral-700/50" />
                    <div className="h-6 w-full bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-md flex items-center justify-center font-semibold text-[10px]">
                      Submit
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-20 flex items-center justify-center text-[11px] text-neutral-400 font-mono"
                  >
                    Waiting for input...
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400">
              <span>AI Component Engine</span>
              <span className="text-purple-500">Live</span>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 leading-snug">
            Innovating where it's desperately desired.
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Architecting effective platforms. Addressing novel challenges with aggressive pace.
          </p>
        </div>
      </div>

    </div>
  );
}