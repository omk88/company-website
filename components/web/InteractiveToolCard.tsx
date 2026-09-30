"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Database, Cpu, Globe, CheckCircle2, Zap, ArrowRight } from "lucide-react";

const toolsData = [
  {
    id: "api",
    name: "REST & GraphQL",
    icon: Globe,
    metrics: { status: "Active", latency: "12ms", uptime: "99.99%" },
    color: "from-blue-500/10 to-indigo-500/10",
    accent: "text-blue-500",
    border: "border-blue-500/20",
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    id: "db",
    name: "Database Architect",
    icon: Database,
    metrics: { status: "Synced", queries: "1.2k/s", engine: "PostgreSQL" },
    color: "from-emerald-500/10 to-teal-500/10",
    accent: "text-emerald-500",
    border: "border-emerald-500/20",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "ops",
    name: "CI/CD & Serverless",
    icon: Cpu,
    metrics: { status: "Deployed", edge: "240 Nodes", speed: "Instant" },
    color: "from-amber-500/10 to-orange-500/10",
    accent: "text-amber-500",
    border: "border-amber-500/20",
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
];

export default function InteractiveToolCard() {
  const [activeTool, setActiveTool] = useState(toolsData[0]);

  return (
    <div className="w-full max-w-sm rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 shadow-xl overflow-hidden font-sans">
      <div className="relative h-52 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 p-4 flex flex-col justify-between overflow-hidden border border-neutral-100 dark:border-neutral-800/50">
        
        <motion.div
          key={activeTool.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className={`absolute inset-0 bg-gradient-to-br ${activeTool.color} blur-xl pointer-events-none`}
        />

        <div className="relative z-10 flex items-center gap-1.5 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md p-1 rounded-xl border border-neutral-200/60 dark:border-neutral-800">
          {toolsData.map((tool) => {
            const Icon = tool.icon;
            const isSelected = activeTool.id === tool.id;

            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool)}
                className={`relative flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isSelected
                    ? "text-neutral-900 dark:text-white"
                    : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeToolBg"
                    className="absolute inset-0 bg-white dark:bg-neutral-800 rounded-lg shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  <Icon className="w-3.5 h-3.5" />
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTool.id}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className={`relative z-10 p-3.5 rounded-xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border ${activeTool.border} shadow-sm`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-md ${activeTool.badge}`}>
                  <activeTool.icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  {activeTool.name}
                </span>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${activeTool.badge} flex items-center gap-1`}>
                <CheckCircle2 className="w-3 h-3" />
                {activeTool.metrics.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {Object.entries(activeTool.metrics)
                .filter(([key]) => key !== "status")
                .map(([key, value]) => (
                  <div key={key} className="bg-neutral-100/60 dark:bg-neutral-800/50 p-2 rounded-lg">
                    <p className="text-neutral-400 capitalize text-[9px]">{key}</p>
                    <p className="font-mono font-medium text-neutral-700 dark:text-neutral-300">
                      {value}
                    </p>
                  </div>
                ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 flex items-center justify-between text-[10px] text-neutral-400 pt-1">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" /> Auto-Configured
          </span>
          <span className="font-mono">v2.4.0</span>
        </div>
      </div>

      <div className="pt-4 px-1 pb-1">
        <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center mb-3 text-neutral-700 dark:text-neutral-300">
          <Wrench className="w-4 h-4" />
        </div>

        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-1.5">
          Providing tools that you need.
        </h3>
        
        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Delivering digital solutions to difficult problems. Pushing the bounds of the possible.
        </p>
      </div>
    </div>
  );
}