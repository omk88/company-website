"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  Database,
  Cpu,
  Globe,
  CheckCircle2,
  ChevronsUp,
  Sparkles,
  Zap,
  SlidersHorizontal,
  Bot,
  Activity,
  ArrowRight,
  Layers,
  ShieldAlert,
} from "lucide-react";

// ==========================================
// CARD 1 DATA (TAB SELECTOR)
// ==========================================
const toolsData = [
  {
    id: "api",
    name: "REST & GraphQL",
    icon: Globe,
    metrics: { status: "Active", latency: "12ms", uptime: "99.99%" },
    color: "from-blue-500/10 to-indigo-500/10",
    border: "border-blue-500/20",
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    id: "db",
    name: "Database Architect",
    icon: Database,
    metrics: { status: "Synced", queries: "1.2k/s", engine: "PostgreSQL" },
    color: "from-emerald-500/10 to-teal-500/10",
    border: "border-emerald-500/20",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "ops",
    name: "CI/CD Pipeline",
    icon: Cpu,
    metrics: { status: "Deployed", edge: "240 Nodes", speed: "Instant" },
    color: "from-amber-500/10 to-orange-500/10",
    border: "border-amber-500/20",
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
];

// ==========================================
// CARD 3 DATA (NODE PIPELINE)
// ==========================================
const pipelineNodes = [
  {
    id: "ingest",
    label: "Ingest",
    icon: Activity,
    desc: "Sub-10ms event streamer",
    color: "text-blue-500 bg-blue-500/10 border-blue-500/30",
  },
  {
    id: "model",
    label: "AI Engine",
    icon: Bot,
    desc: "Edge-hosted LLM inference",
    color: "text-purple-500 bg-purple-500/10 border-purple-500/30",
  },
  {
    id: "output",
    label: "Output",
    icon: Zap,
    desc: "Optimized state sync",
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
  },
];

export default function VisionCards() {
  const [activeTool, setActiveTool] = useState(toolsData[0]);

  const [sliderValue, setSliderValue] = useState(75);

  const [activeNode, setActiveNode] = useState(pipelineNodes[1]);

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-4 font-sans">
      <div className="w-full rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 shadow-xl overflow-hidden flex flex-col justify-between">
        <div className="relative h-56 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 p-4 flex flex-col justify-between overflow-hidden border border-neutral-100 dark:border-neutral-800/50">
          <motion.div
            key={activeTool.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`absolute inset-0 bg-gradient-to-br ${activeTool.color} blur-xl pointer-events-none`}
          />

          {/* Tab Selector */}
          <div className="relative z-10 flex items-center gap-1.5 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md p-1 rounded-xl border border-neutral-200/60 dark:border-neutral-800">
            {toolsData.map((tool) => {
              const Icon = tool.icon;
              const isSelected = activeTool.id === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool)}
                  className={`relative flex-1 flex items-center justify-center py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isSelected
                      ? "text-neutral-900 dark:text-white"
                      : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeToolTab"
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
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
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

          <div className="relative z-10 flex items-center justify-between text-[10px] text-neutral-400">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500 fill-amber-500" /> Modular Setup
            </span>
            <span className="font-mono">Click tabs to switch</span>
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

      <div className="w-full rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 shadow-xl overflow-hidden flex flex-col justify-between">
        <div className="relative h-56 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 p-4 flex flex-col justify-between overflow-hidden border border-neutral-100 dark:border-neutral-800/50">
          
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            <span className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-500" /> Efficiency Meter
            </span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              {sliderValue}% Agility
            </span>
          </div>

          <div className="space-y-2 my-auto">
            <div className="p-3 rounded-xl bg-white/90 dark:bg-neutral-900/90 border border-emerald-500/20 shadow-sm">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-emerald-500" /> Lean Shipping
                </span>
                <span className="font-mono text-emerald-500 font-bold text-[11px]">
                  {Math.round((sliderValue / 100) * 14)} Days
                </span>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-150"
                  style={{ width: `${sliderValue}%` }}
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-neutral-100/60 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-800/50 opacity-60">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-neutral-500 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-neutral-400" /> Legacy Process
                </span>
                <span className="font-mono text-neutral-400">180 Days</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-1">
            <input
              type="range"
              min="10"
              max="100"
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[9px] text-neutral-400 mt-1">
              <span>Enterprise Bloat</span>
              <span>Lean Velocity</span>
            </div>
          </div>
        </div>

        <div className="pt-4 px-1 pb-1">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center mb-3 text-neutral-700 dark:text-neutral-300">
            <ChevronsUp className="w-4 h-4" />
          </div>
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-1.5">
            Staying lean. Doing what others can't.
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Working with agility. Responding to the market. Out maneuvering enterprises.
          </p>
        </div>
      </div>

      <div className="w-full rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 shadow-xl overflow-hidden flex flex-col justify-between">
        <div className="relative h-56 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 p-4 flex flex-col justify-between overflow-hidden border border-neutral-100 dark:border-neutral-800/50">
          
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" /> Architecture Flow
            </span>
            <span className="text-[10px] font-mono text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-full">
              Live Pipeline
            </span>
          </div>

          <div className="relative z-10 flex items-center justify-between my-auto px-1">
            {pipelineNodes.map((node, i) => {
              const Icon = node.icon;
              const isSelected = activeNode.id === node.id;

              return (
                <div key={node.id} className="flex items-center">
                  <button
                    onClick={() => setActiveNode(node)}
                    className={`relative p-2.5 rounded-xl border transition-all ${
                      isSelected
                        ? `${node.color} scale-110 shadow-md`
                        : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-neutral-600"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>

                  {i < pipelineNodes.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-neutral-300 dark:text-neutral-700 mx-1.5 animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="p-2.5 rounded-xl bg-white/90 dark:bg-neutral-900/90 border border-neutral-200/80 dark:border-neutral-800 text-xs"
            >
              <div className="flex justify-between items-center mb-0.5">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {activeNode.label}
                </span>
                <span className="text-[9px] font-mono text-emerald-500 font-medium">Ready</span>
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                {activeNode.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="pt-4 px-1 pb-1">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center mb-3 text-neutral-700 dark:text-neutral-300">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-1.5">
            Innovating where it's desperately desired.
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Architecting effective platforms. Addressing novel challenges.
          </p>
        </div>
      </div>

    </div>
  );
}