"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GitBranch, 
  GitCommit, 
  Folder, 
  FileCode, 
  Loader2, 
  Check, 
  Play, 
  Circle,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Commit {
  sha: string;
  message: string;
  time: string;
  author: string;
  additions: number;
  deletions: number;
}

const mockCommits: Commit[] = [
  {
    sha: "8f3a1d9",
    message: "feat(core): implement high-throughput streaming engine",
    time: "12m ago",
    author: "taqtiq-bot",
    additions: 142,
    deletions: 12,
  },
  {
    sha: "3c92e10",
    message: "fix(auth): address zero-downtime key rotation gap",
    time: "2h ago",
    author: "lead-dev",
    additions: 24,
    deletions: 8,
  },
  {
    sha: "1a44f8b",
    message: "refactor(api): transition schema to type-safe RPC models",
    time: "5h ago",
    author: "taqtiq-bot",
    additions: 89,
    deletions: 64,
  },
];

const codeSnippet = [
  { line: 1, content: "export async function handlePipeline(req: Request) {", type: "neutral" },
  { line: 2, content: "  const { id, env } = await req.json();", type: "neutral" },
  { line: 3, content: "- const legacy = new LegacyDeployer({ id });", type: "deletion" },
  { line: 4, content: "+ const engine = await Engine.init({ env });", type: "addition" },
  { line: 5, content: "+ const ship = await engine.ship({ zeroDowntime: true });", type: "addition" },
  { line: 6, content: "  return Response.json({ status: 'deployed', sha: ship.sha });", type: "neutral" },
  { line: 7, content: "}", type: "neutral" },
];

export default function GitHubWorkbench() {
  const [activeTab, setActiveTab] = useState<"code" | "commits">("code");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);

  const handleDeploy = () => {
    setIsDeploying(true);
    setDeploySuccess(false);

    setTimeout(() => {
      setIsDeploying(false);
      setDeploySuccess(true);
      setTimeout(() => setDeploySuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="w-full h-full p-2 sm:p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        /* Fixed locked width across both states */
        className="w-full max-w-lg min-w-[320px] sm:min-w-[480px] border border-neutral-800 bg-neutral-950 rounded-xl shadow-2xl overflow-hidden font-sans text-[11px] text-neutral-300"
      >
        {/* Header */}
        <div className="bg-neutral-900/90 px-3 py-2 border-b border-neutral-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-300 min-w-0">
            <span className="text-neutral-500 shrink-0">taqtiq /</span>
            <span className="font-semibold text-neutral-100 truncate">core-platform</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] border border-neutral-700 text-neutral-400 shrink-0">
              Private
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-950 border border-neutral-800 font-mono text-[10px] text-neutral-300">
              <GitBranch className="w-3 h-3 text-neutral-400" />
              <span>main</span>
            </div>

            <button
              onClick={handleDeploy}
              disabled={isDeploying}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-sm transition-all disabled:opacity-50 cursor-pointer text-[10px]"
            >
              {isDeploying ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : deploySuccess ? (
                <Check className="w-3 h-3 text-emerald-200" />
              ) : (
                <Play className="w-2.5 h-2.5 fill-white" />
              )}
              <span>{isDeploying ? "Deploying..." : deploySuccess ? "Deployed" : "Run Action"}</span>
            </button>
          </div>
        </div>

        {/* Subheader / Tabs */}
        <div className="px-3 py-1.5 bg-neutral-900/40 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-1 font-mono text-[10px] text-neutral-400">
            <Folder className="w-3 h-3 text-blue-400" />
            <span>src /</span>
            <FileCode className="w-3 h-3 text-neutral-400 ml-0.5" />
            <span className="text-neutral-200 font-medium">pipeline.ts</span>
          </div>

          <div className="flex bg-neutral-900 p-0.5 rounded-md font-mono text-[9px] border border-neutral-800">
            <button
              onClick={() => setActiveTab("code")}
              className={cn(
                "px-2 py-0.5 rounded transition-all cursor-pointer",
                activeTab === "code"
                  ? "bg-neutral-800 text-neutral-100 shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              )}
            >
              Code
            </button>
            <button
              onClick={() => setActiveTab("commits")}
              className={cn(
                "px-2 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1",
                activeTab === "commits"
                  ? "bg-neutral-800 text-neutral-100 shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              )}
            >
              <GitCommit className="w-2.5 h-2.5" />
              <span>Commits</span>
            </button>
          </div>
        </div>

        {/* Code Content Container with Fixed Width Behavior */}
        <div className="relative min-h-[200px] bg-neutral-950 p-3 font-mono overflow-hidden w-full">
          <AnimatePresence mode="wait">
            {activeTab === "code" ? (
              <motion.div
                key="code-tab"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="space-y-1 text-[10px] leading-relaxed w-full"
              >
                {codeSnippet.map((row) => (
                  <div
                    key={row.line}
                    className={cn(
                      "flex items-center gap-2 px-1.5 py-0.5 rounded w-full",
                      row.type === "addition" && "bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500",
                      row.type === "deletion" && "bg-red-500/10 text-red-400 border-l-2 border-red-500",
                      row.type === "neutral" && "text-neutral-300"
                    )}
                  >
                    <span className="w-3 text-right text-neutral-600 select-none text-[9px] shrink-0">
                      {row.line}
                    </span>
                    <pre className="font-mono m-0 truncate leading-normal flex-1">{row.content}</pre>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="commits-tab"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="space-y-2 w-full"
              >
                {mockCommits.map((commit) => (
                  <div
                    key={commit.sha}
                    className="p-2 rounded-lg border border-neutral-800/80 bg-neutral-900/40 flex items-center justify-between gap-2 w-full"
                  >
                    <div className="flex items-start gap-2 min-w-0 flex-1">
                      <div className="p-1 rounded bg-neutral-800 text-neutral-300 mt-0.5 shrink-0">
                        <GitCommit className="w-3 h-3" />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-sans font-medium text-neutral-100 truncate text-[11px]">
                          {commit.message}
                        </span>
                        <div className="flex items-center gap-1.5 text-[9px] text-neutral-400 font-mono mt-0.5">
                          <span>{commit.author}</span>
                          <span>•</span>
                          <span>{commit.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-[9px] shrink-0">
                      <span className="text-emerald-400">+{commit.additions}</span>
                      <span className="text-red-400">-{commit.deletions}</span>
                      <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-semibold border border-neutral-700/50">
                        {commit.sha}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-3 py-2 bg-neutral-900/60 border-t border-neutral-800 flex items-center justify-between text-[10px] font-mono text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Circle className={cn(
              "w-1.5 h-1.5 fill-current",
              deploySuccess ? "text-emerald-400" : isDeploying ? "text-amber-400" : "text-emerald-400"
            )} />
            <span>
              {isDeploying ? "Building bundle..." : deploySuccess ? "Deployed to edge network" : "Active stream"}
            </span>
          </div>

          <div className="flex items-center gap-1 text-neutral-400 hover:text-neutral-200 transition-colors">
            <Sparkles className="w-2.5 h-2.5 text-purple-400" />
            <span className="font-sans text-[9px]">Auto-Sync</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}