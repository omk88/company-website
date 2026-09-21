"use client";

import React, { useState, useRef, Children, isValidElement } from "react";
import { Check, Copy, FileCode } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface CodeElementProps {
  className?: string;
  children?: React.ReactNode;
  "data-meta"?: string;
  node?: { meta?: string };
}

export function CodeBlock({
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement> & { node?: any; "data-meta"?: string }) {
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState<"ts" | "js">("ts");
  const preRef = useRef<HTMLPreElement>(null);

  const codeChild = Children.toArray(children).find(
    (child): child is React.ReactElement<CodeElementProps> =>
      isValidElement(child) && child.type === "code"
  );

  const rawNodes = Children.toArray(codeChild?.props?.children || children);

  let topLevelTitle: string | null = null;
  const nodesWithoutTopTitle: React.ReactNode[] = [];

  rawNodes.forEach((node) => {
    const text = typeof node === "string" ? node : (node as any)?.props?.children;
    if (typeof text === "string" && /^\/\/\s*title:\s*(.+)$/m.test(text)) {
      const match = /^\/\/\s*title:\s*(.+)$/m.exec(text);
      if (match && !topLevelTitle) {
        topLevelTitle = match[1].trim();
        return; 
      }
    }
    nodesWithoutTopTitle.push(node);
  });

  const meta =
    codeChild?.props["data-meta"] ||
    codeChild?.props?.node?.meta ||
    props["data-meta"] ||
    props?.node?.meta ||
    "";
  const metaTitleMatch = /title=(?:"([^"]+)"|'([^']+)'|([^\s]+))/.exec(meta);
  const metaTitle = metaTitleMatch
    ? metaTitleMatch[1] || metaTitleMatch[2] || metaTitleMatch[3]
    : null;

  const baseTitle = topLevelTitle || metaTitle || "index.ts";

  const tsNodes: React.ReactNode[] = [];
  const jsNodes: React.ReactNode[] = [];
  let tsTitle: string | undefined = undefined;
  let jsTitle: string | undefined = undefined;
  let currentTarget: "ts" | "js" = "ts";
  let hasDualVersion = false;

  nodesWithoutTopTitle.forEach((node) => {
    const text = typeof node === "string" ? node : (node as any)?.props?.children;

    if (typeof text === "string" && text.includes("--- JS ---")) {
      currentTarget = "js";
      hasDualVersion = true;
      return;
    }
    if (typeof text === "string" && text.includes("--- TS ---")) {
      currentTarget = "ts";
      hasDualVersion = true;
      return;
    }

    if (typeof text === "string" && /^\/\/\s*title:\s*(.+)$/m.test(text)) {
      const match = /^\/\/\s*title:\s*(.+)$/m.exec(text);
      if (match) {
        const val = match[1].trim();
        if (currentTarget === "ts") tsTitle = val;
        else jsTitle = val;
      }
      return;
    }

    if (currentTarget === "ts") tsNodes.push(node);
    else jsNodes.push(node);
  });

  const resolveFilename = (
    lang: "ts" | "js",
    fallback: string,
    tsT?: string,
    jsT?: string
  ): string => {
    if (lang === "js") {
      if (jsT) return jsT;
      if (tsT) return tsT.replace(/\.ts(x)?$/, ".js$1");
      return fallback.replace(/\.ts(x)?$/, ".js$1");
    }
    return tsT || fallback;
  };

  const filename = resolveFilename(language, baseTitle, tsTitle, jsTitle);

  const trimNodeList = (nodes: React.ReactNode[]) => {
    const result = [...nodes];

    while (result.length > 0) {
      const first = result[0];
      if (typeof first === "string") {
        const trimmed = first.replace(/^[\r\n]+/, "");
        if (trimmed) {
          result[0] = trimmed;
          break;
        }
        result.shift();
      } else {
        break;
      }
    }

    while (result.length > 0) {
      const lastIdx = result.length - 1;
      const last = result[lastIdx];

      if (typeof last === "string") {
        const trimmed = last.replace(/[\r\n]+\s*$/, "");
        if (trimmed) {
          result[lastIdx] = trimmed;
          break;
        }
        result.pop();
      } else {
        break;
      }
    }

    return result;
  };

  const activeNodes = hasDualVersion
    ? language === "ts"
      ? trimNodeList(tsNodes)
      : trimNodeList(jsNodes)
    : trimNodeList(nodesWithoutTopTitle);

  const handleCopy = () => {
    const codeText = preRef.current?.innerText || "";
    if (!codeText) return;

    navigator.clipboard.writeText(codeText);
    setCopied(true);
    toast.success("Copied to clipboard!");

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-6 rounded-2xl bg-black border border-neutral-800 overflow-hidden shadow-md">
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900/80 border-b border-neutral-800 text-xs">
        <div className="flex items-center gap-2 font-mono text-neutral-400">
          <FileCode className="w-4 h-4 text-neutral-500" />
          <span>{filename}</span>
        </div>

        <div className="flex items-center gap-3">
          {hasDualVersion && (
            <div className="flex items-center bg-neutral-950 p-0.5 rounded-lg border border-neutral-800">
              <button
                type="button"
                onClick={() => setLanguage("ts")}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                  language === "ts"
                    ? "bg-neutral-800 text-blue-400 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                TS
              </button>
              <button
                type="button"
                onClick={() => setLanguage("js")}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                  language === "js"
                    ? "bg-neutral-800 text-yellow-400 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                JS
              </button>
            </div>
          )}

          <Button
            onClick={handleCopy}
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-md transition-all"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>
      </div>

      <pre
        ref={preRef}
        {...props}
        className="!bg-black !m-0 !rounded-none p-4 overflow-x-auto text-sm leading-relaxed font-mono"
      >
        <code className={`${codeChild?.props?.className || ""} !bg-transparent !p-0 !border-none`}>
          {activeNodes}
        </code>
      </pre>
    </div>
  );
}