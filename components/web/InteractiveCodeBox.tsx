"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Play, CheckCircle2, FileCode, Cpu, LucideIcon } from "lucide-react";

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
      { text: "  engine: \"v6.8\",", color: "text-neutral-400", highlight: "\"v6.8\"", highlightColor: "text-amber-400" },
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

  const handleRun = () => {
    setIsRunning(true);
    setLogs(["Building AST...", "Optimizing bundle size..."]);

    setTimeout(() => {
      setLogs((prev) => [...prev, "✓ Deployed to edge network in 14ms."]);
      setIsRunning(false);
    }, 1200);
  };

  const currentContent = codeFiles[activeTab].content;
  let cumulativeDelay = 0;

  return (
    <div className="lg:col-span-8 w-full max-w-3xl mx-auto isolate">
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
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white/60 dark:bg-neutral-950/70 backdrop-blur-md p-5 font-mono text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 shadow-2xl overflow-hidden"
      >
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-4 pb-3 mb-3 border-b border-neutral-200/60 dark:border-neutral-800/80 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto py-0.5">
            <div className="flex gap-1.5 mr-3 shrink-0">
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
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-neutral-200/60 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium"
                      : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
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
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-emerald-500 font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-full transition-all border border-emerald-500/20 active:scale-95 disabled:opacity-50 shrink-0 ml-auto"
          >
            {isRunning ? (
              <Cpu className="w-3 h-3 animate-spin" />
            ) : (
              <Play className="w-3 h-3 fill-emerald-500" />
            )}
            <span>{isRunning ? "Compiling..." : "Run"}</span>
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
          {logs.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 pt-3 border-t border-neutral-200/50 dark:border-neutral-800/60 bg-neutral-100/50 dark:bg-neutral-900/50 rounded-lg p-2.5 text-[11px]"
            >
              <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span className="font-semibold text-neutral-500 dark:text-neutral-400">Output</span>
              </div>
              <div className="space-y-0.5 text-neutral-600 dark:text-neutral-400">
                {logs.map((log, index) => (
                  <p key={index}>{log}</p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}