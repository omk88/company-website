"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Play, CheckCircle2, FileCode, Cpu, ChevronDown, ChevronUp, X, LucideIcon } from "lucide-react";

interface CodeLine {
  text: string;
  color: string;
  highlight?: string;
  highlightColor?: string;
}

interface FileConfig {
  name: string;
  icon: LucideIcon;
  content: CodeLine[];
}

const codeFiles: Record<"config" | "api", FileConfig> = {
  config: {
    name: "taqtiq.config.ts",
    icon: Terminal,
    content: [
      { text: "export default {", color: "text-purple-400" },
      { text: "  engine: \"v2.4\",", color: "text-neutral-400", highlight: "\"v2.4\"", highlightColor: "text-amber-400" },
      { text: "  architecture: \"microservices\",", color: "text-neutral-400", highlight: "\"microservices\"", highlightColor: "text-amber-400" },
      { text: "  status: \"optimized\"", color: "text-neutral-400", highlight: "\"optimized\"", highlightColor: "text-emerald-400" },
      { text: "};", color: "text-purple-400" },
    ],
  },
  api: {
    name: "api/deploy.ts",
    icon: FileCode,
    content: [
      { text: "async function deploy() {", color: "text-purple-400" },
      { text: "  const build = await taqtiq.compile();", color: "text-neutral-300" },
      { text: "  return build.ship({ zeroDowntime: true });", color: "text-neutral-300", highlight: "true", highlightColor: "text-amber-400" },
      { text: "};", color: "text-purple-400" },
    ],
  },
};

function FormattedText({ line }: { line: CodeLine }) {
  const highlight = line.highlight;

  if (!highlight) {
    return <span className={line.color}>{line.text}</span>;
  }

  const parts = line.text.split(highlight);

  return (
    <span className={line.color}>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <span className={line.highlightColor}>{highlight}</span>
          )}
        </span>
      ))}
    </span>
  );
}

export default function InteractiveCodeBox() {
  const [activeTab, setActiveTab] = useState<keyof typeof codeFiles>("config");
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setIsConsoleOpen(true);
    setIsConsoleCollapsed(false);
    setLogs(["Building AST...", "Optimizing bundle size..."]);

    setTimeout(() => {
      setLogs((prev) => [...prev, "✓ Deployed to edge network in 14ms."]);
      setIsRunning(false);
    }, 1200);
  };

  const currentContent = codeFiles[activeTab].content;
  let cumulativeDelay = 0;

  return (
    <div className="w-full relative isolate min-w-0">
      <style jsx global>{`
        @keyframes cssTypewriter {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes cssLineFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .typewriter-line {
          display: inline-block;
          white-space: pre;
          overflow: hidden;
          vertical-align: bottom;
          animation: cssTypewriter var(--duration) steps(var(--len)) var(--delay) forwards;
          width: 0;
        }
        .typewriter-row {
          opacity: 0;
          animation: cssLineFade 0.01s linear var(--delay) forwards;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white/60 dark:bg-neutral-950/70 backdrop-blur-md p-5 font-mono text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 shadow-2xl overflow-hidden"
      >
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-neutral-200/60 dark:border-neutral-800/80 min-w-0">
          <div className="flex items-center gap-2 overflow-x-auto min-w-0 py-0.5 no-scrollbar">
            <div className="flex gap-1.5 mr-2 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>

            {(Object.keys(codeFiles) as Array<keyof typeof codeFiles>).map((key) => {
              const file = codeFiles[key];
              const Icon = file.icon;
              const isActive = activeTab === key;

              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  disabled={isActive}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-neutral-200/60 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium cursor-default"
                      : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 cursor-pointer"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{file.name}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="inline-flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-wider text-emerald-500 font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1 rounded-full transition-all border border-emerald-500/20 active:scale-95 disabled:opacity-50 shrink-0 ml-auto cursor-pointer leading-none"
          >
            {isRunning ? (
              <Cpu className="w-3 h-3 animate-spin shrink-0" />
            ) : (
              <Play className="w-2.5 h-2.5 fill-emerald-500 shrink-0" />
            )}
            <span className="leading-none pt-[0.5px]">{isRunning ? "Compiling..." : "Run"}</span>
          </button>
        </div>

        <div className="relative min-h-[140px] py-2 overflow-x-auto">
          <div key={activeTab} className="space-y-1.5">
            {currentContent.map((line, idx) => {
              const charCount = line.text.length;
              const duration = charCount * 0.03;
              const delay = cumulativeDelay;

              cumulativeDelay += duration;

              return (
                <div
                  key={`${activeTab}-${idx}`}
                  className="typewriter-row flex items-start gap-4"
                  style={{ "--delay": `${delay}s` } as React.CSSProperties}
                >
                  <span className="text-neutral-400/40 select-none text-[10px] w-3 text-right shrink-0 leading-relaxed">
                    {idx + 1}
                  </span>
                  <p className="font-mono relative m-0 leading-relaxed whitespace-pre">
                    <span
                      className="typewriter-line"
                      style={
                        {
                          "--len": charCount,
                          "--duration": `${duration}s`,
                          "--delay": `${delay}s`,
                        } as React.CSSProperties
                      }
                    >
                      <FormattedText line={line} />
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {logs.length > 0 && isConsoleOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-4 right-4 bottom-3 z-20 bg-neutral-900/95 border border-neutral-800 rounded-lg text-[11px] shadow-2xl backdrop-blur-md overflow-hidden"
            >
              <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-900/90 border-b border-neutral-800/80">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="font-semibold text-neutral-200">Output</span>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    ({logs.length} logs)
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsConsoleCollapsed(!isConsoleCollapsed)}
                    className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
                    title={isConsoleCollapsed ? "Expand Console" : "Collapse Console"}
                    aria-label={isConsoleCollapsed ? "Expand Console" : "Collapse Console"}
                  >
                    {isConsoleCollapsed ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => setIsConsoleOpen(false)}
                    className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
                    title="Close Console"
                    aria-label="Close Console"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <motion.div
                animate={{ height: isConsoleCollapsed ? 0 : "auto" }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-3 space-y-1 font-mono text-neutral-300 max-h-28 overflow-y-auto">
                  {logs.map((log, index) => (
                    <p key={index} className="leading-relaxed">
                      {log}
                    </p>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}