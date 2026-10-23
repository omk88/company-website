"use client";

import React, { useState, Children, isValidElement } from "react";
import Image from "next/image";
import { Check, Copy, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button"; 
import { toast } from "sonner";
import { common, createLowlight } from "lowlight";

import jsIcon from "./jsvector.svg"; 
import tsIcon from "./tsvector.svg";

const lowlight = createLowlight(common);

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
  node: preNode,
  ...props
}: React.HTMLAttributes<HTMLPreElement> & { node?: any; "data-meta"?: string }) {
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState<string>("ts");

  const codeChild = Children.toArray(children).find(
    (child): child is React.ReactElement<any> =>
      isValidElement(child) && child.type === "code"
  );

  const codeProps = codeChild?.props || {};
  const rawClassName =
    codeProps.className ||
    codeProps.node?.properties?.className ||
    preNode?.properties?.className ||
    props.className ||
    "";

  const className = Array.isArray(rawClassName)
    ? rawClassName.join(" ")
    : String(rawClassName);

  const rawText = extractText(codeProps.children || children);
  const lines = rawText.split("\n");

  const isClassJs = /js|javascript|jsx/i.test(className);
  const isClassTs = /ts|typescript|tsx/i.test(className);

  const sections: Record<string, string[]> = { ts: [], js: [] };
  const sectionTitles: Record<string, string> = {};
  let globalTitle: string | null = null;
  let currentTarget: string = isClassJs && !isClassTs ? "js" : "ts";
  const explicitLangs = new Set<string>();

  lines.forEach((line) => {
    const trimmed = line.trim();

    const langMatch = /^\/\/\s*(?:lang|language):\s*(.+)$/i.exec(trimmed);
    if (langMatch) {
      const langStr = langMatch[1].trim().toLowerCase();
      if (/js|javascript|jsx/.test(langStr)) {
        currentTarget = "js";
        explicitLangs.add("js");
      } else if (/ts|typescript|tsx/.test(langStr)) {
        currentTarget = "ts";
        explicitLangs.add("ts");
      }
      return;
    }

    const titleMatch = /^\/\/\s*title:\s*(.+)$/i.exec(trimmed);
    if (titleMatch) {
      const extractedTitle = titleMatch[1].trim();
      if (!globalTitle) globalTitle = extractedTitle;
      if (!sectionTitles[currentTarget]) {
        sectionTitles[currentTarget] = extractedTitle;
      }
      return;
    }

    if (!sections[currentTarget]) {
      sections[currentTarget] = [];
    }
    sections[currentTarget].push(line);
  });

  const activeLangs = Object.keys(sections).filter((l) => sections[l].length > 0);
  const hasDualVersion = activeLangs.length > 1 || explicitLangs.size > 1;

  const defaultLang = explicitLangs.size === 1
    ? Array.from(explicitLangs)[0]
    : (isClassJs && !isClassTs ? "js" : "ts");

  const activeLanguage = hasDualVersion ? language : defaultLang;
  const hasKnownLanguage = activeLangs.length > 0 || isClassJs || isClassTs;

  const filename = sectionTitles[activeLanguage] || globalTitle || null;

  const activeCodeLines = sections[activeLanguage]?.length > 0
    ? sections[activeLanguage]
    : (sections["ts"].length > 0 ? sections["ts"] : sections["js"]);

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
    try {
      const tree = lowlight.highlight(targetLang, cleanCode);
      return renderLowlightTree(tree.children);
    } catch {
      return cleanCode;
    }
  };

  return (
    <div className="not-prose grid grid-cols-1 max-h-[270px] h-auto w-full max-w-full my-6 rounded-lg bg-black border border-neutral-800 shadow-md overflow-hidden min-w-0">
      <div className="flex items-center justify-between px-4 h-10 shrink-0 bg-neutral-900/80 border-b border-neutral-800 text-xs select-none">
        <div className="flex items-center gap-2 font-mono text-neutral-400 min-w-0">
          {hasKnownLanguage && (
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

      <div className="w-full min-w-0 max-h-[calc(270px-2.5rem)] overflow-auto scrollbar-thin scrollbar-thumb-neutral-800">
        <pre
          {...props}
          className="hljs !bg-black !m-0 p-4 text-sm leading-relaxed font-mono min-w-full w-max block whitespace-pre"
        >
          <code className={`${className} !bg-transparent !p-0 !border-none [&_*]:!bg-transparent block`}>
            {getHighlightedContent()}
          </code>
        </pre>
      </div>
    </div>
  );
}