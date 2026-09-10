"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type NodeColor = "emerald" | "amber" | "sky" | "orange";

interface RegionNode {
  id: string;
  name: string;
  code: string;
  latency: string;
  x: number;
  y: number;
  color: NodeColor;
}

const COLOR_STYLES: Record<NodeColor, { core: string; pulse: string; glow: string; badge: string }> = {
  emerald: {
    core: "fill-emerald-400 stroke-emerald-200",
    pulse: "fill-emerald-500/20 stroke-emerald-400/50",
    glow: "drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]",
    badge: "text-emerald-400",
  },
  amber: {
    core: "fill-amber-400 stroke-amber-100",
    pulse: "fill-amber-500/20 stroke-amber-400/50",
    glow: "drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]",
    badge: "text-amber-400",
  },
  sky: {
    core: "fill-sky-400 stroke-sky-100",
    pulse: "fill-sky-500/20 stroke-sky-400/50",
    glow: "drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]",
    badge: "text-sky-400",
  },
  orange: {
    core: "fill-orange-400 stroke-orange-100",
    pulse: "fill-orange-500/20 stroke-orange-400/50",
    glow: "drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]",
    badge: "text-orange-400",
  },
};

const DENSE_NODES: RegionNode[] = [
  { id: "us-east-1", name: "US East (N. Virginia)", code: "iad1", latency: "4ms", x: 280, y: 180, color: "sky" },
  { id: "us-east-2", name: "US East (Ohio)", code: "cmh1", latency: "6ms", x: 260, y: 170, color: "sky" },
  { id: "us-west-1", name: "US West (Oregon)", code: "pdx1", latency: "12ms", x: 160, y: 160, color: "amber" },
  { id: "us-west-2", name: "US West (N. California)", code: "sfo1", latency: "10ms", x: 150, y: 180, color: "amber" },
  { id: "us-south-1", name: "US South (Texas)", code: "dfw1", latency: "8ms", x: 220, y: 210, color: "orange" },

  { id: "eu-central", name: "Europe (Frankfurt)", code: "fra1", latency: "8ms", x: 520, y: 150, color: "emerald" },
  { id: "eu-west-1", name: "Europe (London)", code: "lhr1", latency: "6ms", x: 490, y: 140, color: "amber" },
  { id: "eu-west-2", name: "Europe (Paris)", code: "cdg1", latency: "7ms", x: 500, y: 160, color: "orange" },
  { id: "eu-north", name: "Europe (Stockholm)", code: "arn1", latency: "14ms", x: 540, y: 110, color: "sky" },
  { id: "eu-south", name: "Europe (Milan)", code: "mxp1", latency: "11ms", x: 525, y: 175, color: "amber" },

  { id: "ap-east-1", name: "Asia Pacific (Tokyo)", code: "hnd1", latency: "18ms", x: 820, y: 190, color: "sky" },
  { id: "ap-east-2", name: "Asia Pacific (Osaka)", code: "kix1", latency: "20ms", x: 805, y: 200, color: "orange" },
  { id: "ap-south-1", name: "Asia Pacific (Singapore)", code: "sin1", latency: "22ms", x: 760, y: 290, color: "emerald" },
  { id: "ap-south-2", name: "Asia Pacific (Mumbai)", code: "bom1", latency: "28ms", x: 670, y: 230, color: "amber" },
  { id: "ap-southeast", name: "Asia Pacific (Sydney)", code: "syd1", latency: "35ms", x: 850, y: 360, color: "sky" },

  { id: "sa-east", name: "South America (São Paulo)", code: "gru1", latency: "34ms", x: 360, y: 320, color: "orange" },
  { id: "af-south", name: "Africa (Cape Town)", code: "cpt1", latency: "42ms", x: 530, y: 350, color: "emerald" },
];

const CONNECTIONS: [number, number][] = [
  [2, 0], [0, 6], [6, 5], [5, 10], [10, 12], [0, 15], [5, 16], [12, 14]
];

export function GlobalReachMap() {
  const [activeNode, setActiveNode] = useState<RegionNode | null>(null);

  return (
    <div className="w-full bg-transparent py-12 my-4 relative">

      <div className="relative w-full aspect-[2/1] bg-transparent overflow-hidden flex items-center justify-center">
        
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center p-2 opacity-50 dark:opacity-40"
          style={{
            maskImage: "radial-gradient(circle at center, black 70%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(circle at center, black 70%, transparent 100%)"
          }}
        >
          <img 
            src="/world.svg" 
            alt="World Map Grid" 
            className="w-full h-full object-contain filter invert dark:invert-0 drop-shadow-[0_0_15px_rgba(56,189,248,0.35)]"
          />
        </div>

        <svg
          viewBox="0 0 1000 500"
          className="relative z-10 w-full h-full select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {CONNECTIONS.map(([sourceIdx, targetIdx], i) => {
            const start = DENSE_NODES[sourceIdx];
            const end = DENSE_NODES[targetIdx];
            
            if (!start || !end) return null;

            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2 - 35;
            const pathD = `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;

            return (
              <g key={`connection-${i}`}>
                <path
                  d={pathD}
                  stroke="currentColor"
                  className="text-neutral-500/20 dark:text-neutral-600/30"
                  strokeWidth="0.75"
                  strokeDasharray="3 3"
                  fill="none"
                />
                <motion.path
                  d={pathD}
                  stroke="currentColor"
                  className="text-sky-400/80 drop-shadow-[0_0_6px_rgba(56,189,248,0.7)]"
                  strokeWidth="1.25"
                  fill="none"
                  initial={{ pathLength: 0, pathOffset: 0 }}
                  animate={{
                    pathLength: [0, 0.35, 0],
                    pathOffset: [0, 1, 1],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }}
                />
              </g>
            );
          })}

          {DENSE_NODES.map((node) => {
            const isHovered = activeNode?.id === node.id;
            const styles = COLOR_STYLES[node.color];

            return (
              <g
                key={node.id}
                className="cursor-pointer group"
                onMouseEnter={() => setActiveNode(node)}
                onMouseLeave={() => setActiveNode(null)}
              >
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r="12"
                  className={`${styles.pulse} ${styles.glow}`}
                  strokeWidth="0.75"
                  animate={{ scale: [0.7, 1.6, 0.7], opacity: [0.7, 0.1, 0.7] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                />

                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? "5" : "3.5"}
                  className={`${styles.core} ${styles.glow} transition-all duration-150`}
                  strokeWidth="1.5"
                />
              </g>
            );
          })}
        </svg>

        <AnimatePresence>
          {activeNode && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              style={{
                left: `${(activeNode.x / 1000) * 100}%`,
                top: `${(activeNode.y / 500) * 100}%`,
              }}
              className="absolute z-20 -translate-x-1/2 -translate-y-full mb-3 pointer-events-none"
            >
              <div className="bg-neutral-950/90 text-white text-xs py-1.5 px-3 rounded-md shadow-2xl backdrop-blur-md whitespace-nowrap flex items-center gap-2 border border-neutral-800">
                <span className={`w-2 h-2 rounded-full bg-current ${COLOR_STYLES[activeNode.color].badge}`} />
                <span className="font-medium text-neutral-200">{activeNode.name}</span>
                <span className="font-mono text-[10px] text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">
                  {activeNode.code}
                </span>
                <span className={`font-mono font-semibold ${COLOR_STYLES[activeNode.color].badge}`}>
                  {activeNode.latency}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}