"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "../ui/button";

export function CodeBlock({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);

  const extractText = (node: React.ReactNode): string => {
    if (typeof node === "string") return node;
    if (Array.isArray(node)) return node.map(extractText).join("");
    if (node && typeof node === "object" && "props" in node) {
      return extractText((node.props as { children?: React.ReactNode }).children);
    }
    return "";
  };

  const handleCopy = () => {
    const text = extractText(children);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6 rounded-2xl bg-black border border-neutral-800 overflow-hidden">
      <Button
        onClick={handleCopy}
        className="cursor-pointer absolute top-3 right-3 z-10 p-1.5 rounded-md text-neutral-400 bg-neutral-900/80 hover:text-white hover:bg-neutral-800 transition-all"
      >
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
      </Button>

      <pre
        {...props}
        className="!bg-transparent !m-0 !rounded-none p-4 overflow-x-auto text-sm leading-relaxed [&_code]:!bg-transparent [&_code]:!p-0"
      >
        {children}
      </pre>
    </div>
  );
}