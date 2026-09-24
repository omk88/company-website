"use client";

import React, { useState, Children, isValidElement } from "react";
import Image from "next/image";
import { Check, Copy, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { common, createLowlight } from "lowlight";

import jsIcon from "./jsvector.svg";
import tsIcon from "./tsvector.svg";

const lowlight = createLowlight(common);

interface CodeElementProps {
  className?: string;
  children?: React.ReactNode;
  "data-meta"?: string;
  node?: { meta?: string };
}

function extractText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) return extractText((node.props as any)?.children);
  return "";
}

function renderLowlightTree(nodes: any[], keyPrefix = "ll"): React.ReactNode {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`;
    if (node.type === "text") return node.value;
    if (node.type === "element") {
      const tagName = node.tagName || "span";
      const props: any = { key };
      if (node.properties?.className) {
        props.className = Array.isArray(node.properties.className)
          ? node.properties.className.join(" ")
          : node.properties.className;
      }
      return React.createElement(
        tagName,
        props,
        renderLowlightTree(node.children || [], key)
      );
    }
    return null;
  });
}

export function CodeBlock({
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement> & { node?: any; "data-meta"?: string }) {
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState<"ts" | "js">("ts");

  const codeChild = Children.toArray(children).find(
    (child): child is React.ReactElement<CodeElementProps> =>
      isValidElement(child) && child.type === "code"
  );

  const className = codeChild?.props?.className || props.className || "";
  const langMatch = /language-([^\s]+)/.exec(className);
  const detectedLang = langMatch ? langMatch[1].toLowerCase() : "";

  const isTs = detectedLang === "ts" || detectedLang === "typescript" || detectedLang === "tsx";
  const isJs = detectedLang === "js" || detectedLang === "javascript" || detectedLang === "jsx";
  const hasKnownLanguage = isTs || isJs;

  const rawText = extractText(codeChild?.props?.children || children);
  const lines = rawText.split("\n");

  let topTitle: string | null = null;
  let tsTitle: string | undefined = undefined;
  let jsTitle: string | undefined = undefined;

  const tsLines: string[] = [];
  const jsLines: string[] = [];
  let currentTarget: "ts" | "js" = "ts";
  let hasDualVersion = false;

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed === "--- JS ---") {
      currentTarget = "js";
      hasDualVersion = true;
      return;
    }
    if (trimmed === "--- TS ---") {
      currentTarget = "ts";
      hasDualVersion = true;
      return;
    }

    const titleMatch = /^\/\/\s*title:\s*(.+)$/i.exec(trimmed);
    if (titleMatch) {
      const extractedTitle = titleMatch[1].trim();
      if (!topTitle) topTitle = extractedTitle;

      if (currentTarget === "ts" && !tsTitle) tsTitle = extractedTitle;
      if (currentTarget === "js" && !jsTitle) jsTitle = extractedTitle;
      return;
    }

    if (currentTarget === "ts") tsLines.push(line);
    else jsLines.push(line);
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

  const baseTitle = topTitle || metaTitle || "";

  const resolveFilename = (
    lang: "ts" | "js",
    fallback: string,
    tTitle?: string,
    jTitle?: string
  ): string => {
    if (lang === "js") {
      if (jTitle) return jTitle;
      if (tTitle) return tTitle.replace(/\.ts(x)?$/, ".js$1");
      return fallback.replace(/\.ts(x)?$/, ".js$1");
    }
    return tTitle || fallback;
  };

  const activeLanguage = hasDualVersion ? language : isJs ? "js" : "ts";
  const filename = resolveFilename(activeLanguage, baseTitle, tsTitle, jsTitle);

  const activeCodeLines = hasDualVersion
    ? language === "ts"
      ? tsLines
      : jsLines
    : tsLines;

  const cleanCode = activeCodeLines.join("\n").replace(/^[\r\n]+|[\r\n]+\s*$/g, "");

  const handleCopy = () => {
    if (!cleanCode) return;
    navigator.clipboard.writeText(cleanCode);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const renderIcon = () => {
    if (activeLanguage === "js") {
      return (
        <Image
          src={jsIcon}
          alt="JavaScript"
          width={16}
          height={16}
          className="w-4 h-4 rounded-[2px] shrink-0 object-contain"
        />
      );
    }
    if (activeLanguage === "ts") {
      return (
        <Image
          src={tsIcon}
          alt="TypeScript"
          width={16}
          height={16}
          className="w-4 h-4 rounded-[2px] shrink-0 object-contain"
        />
      );
    }
    return <FileCode className="w-4 h-4 text-neutral-500 shrink-0" />;
  };

  const getHighlightedContent = () => {
    if (!cleanCode) return null;

    const targetLang = activeLanguage === "ts" ? "typescript" : "javascript";
    const highlightLang = lowlight.registered(detectedLang)
      ? detectedLang
      : targetLang;

    try {
      const tree = lowlight.highlight(highlightLang, cleanCode);
      return renderLowlightTree(tree.children);
    } catch {
      return cleanCode;
    }
  };

  return (
    <div className="relative my-6 rounded-lg bg-black border border-neutral-800 overflow-hidden shadow-md w-full max-w-full">
      <div className="flex items-center justify-between px-4 h-10 bg-neutral-900/80 border-b border-neutral-800 text-xs">
        <div className="flex items-center gap-2 font-mono text-neutral-400 min-w-0">
          {(hasKnownLanguage || hasDualVersion || filename) && (
            <div className="flex items-center justify-center shrink-0">
              {renderIcon()}
            </div>
          )}
          {filename && (
            <span className="truncate text-neutral-300 leading-none flex items-center">
              {filename}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {hasDualVersion && (
            <div className="flex items-center bg-neutral-950 p-0.5 rounded-lg border border-neutral-800">
              <button
                type="button"
                onClick={() => setLanguage("ts")}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                  language === "ts"
                    ? "bg-neutral-800 text-blue-400 shadow-sm cursor-default"
                    : "text-neutral-500 hover:text-neutral-300 cursor-pointer"
                }`}
              >
                TS
              </button>
              <button
                type="button"
                onClick={() => setLanguage("js")}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                  language === "js"
                    ? "bg-neutral-800 text-yellow-400 shadow-sm cursor-default"
                    : "text-neutral-500 hover:text-neutral-300 cursor-pointer"
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
            className="cursor-pointer h-7 w-7 p-0 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-md transition-all flex items-center justify-center"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <ScrollArea className="w-full h-full max-h-[500px]">
          <pre
            {...props}
            className="hljs !bg-black !m-0 !rounded-none p-4 text-sm leading-relaxed font-mono w-max min-w-full block"
          >
            <code className={`${className} !bg-transparent !p-0 !border-none [&_*]:!bg-transparent`}>
              {getHighlightedContent()}
            </code>
          </pre>
          <ScrollBar orientation="vertical" className="bg-neutral-900/50" />
          <ScrollBar orientation="horizontal" className="bg-neutral-900/50" />
        </ScrollArea>
      </div>
    </div>
  );
}