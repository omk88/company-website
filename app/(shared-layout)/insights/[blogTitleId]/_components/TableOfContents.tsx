"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Heading } from "../_utils/extractHeadings";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TOCProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TOCProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeId, setActiveId] = React.useState<string>("");
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const processedHeadings = React.useMemo(() => {
    const idCounts = new Map<string, number>();

    return headings.map((heading, index) => {
      const rawId = heading.id || heading.text.toLowerCase().replace(/\s+/g, "-");
      const count = idCounts.get(rawId) || 0;
      idCounts.set(rawId, count + 1);

      const uniqueId = count === 0 ? rawId : `${rawId}-${count}`;

      return {
        ...heading,
        uniqueId,
        index,
      };
    });
  }, [headings]);

  React.useEffect(() => {
    if (processedHeadings.length === 0) return;

    const visibleHeadings = new Map<string, IntersectionObserverEntry>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleHeadings.set(entry.target.id, entry);
          } else {
            visibleHeadings.delete(entry.target.id);
          }
        });

        const sorted = Array.from(visibleHeadings.values()).sort(
          (a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top
        );

        if (sorted.length > 0) {
          setActiveId(sorted[0].target.id);
        }
      },
      { rootMargin: "-10% 0px -65% 0px", threshold: 0 }
    );

    processedHeadings.forEach((heading) => {
      const element = document.getElementById(heading.uniqueId);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [processedHeadings]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (processedHeadings.length === 0) return null;

  const activeHeading = processedHeadings.find((h) => h.uniqueId === activeId);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, uniqueId: string) => {
    e.preventDefault();
    setIsOpen(false);
    setActiveId(uniqueId);

    const targetElement = document.getElementById(uniqueId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="sticky top-12 md:top-16 z-40 w-full h-12 mb-8 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transform-gpu touch-pan-y"
    >
      <div className="relative max-w-none px-2 h-full">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="cursor-pointer flex items-center justify-between w-full h-full text-sm text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2 overflow-hidden min-w-0 pr-4 py-1">
            <span className="font-medium text-zinc-500 dark:text-zinc-400 shrink-0">
              On this page:
            </span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {activeHeading ? activeHeading.text : "Overview"}
            </span>
          </div>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 border-t border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg">
            <ScrollArea className="h-64 p-3">
              <div className="space-y-1">
                {processedHeadings.map((heading) => {
                  const isActive = heading.uniqueId === activeId;
                  const indentClass =
                    heading.level === 1
                      ? "ml-0"
                      : heading.level === 2
                      ? "ml-3"
                      : heading.level === 3
                      ? "ml-6"
                      : "ml-9";

                  return (
                    <a
                      key={heading.uniqueId}
                      href={`#${heading.uniqueId}`}
                      onClick={(e) => handleLinkClick(e, heading.uniqueId)}
                      className={`
                        block text-sm px-2.5 py-1.5 rounded-lg transition-colors truncate ${indentClass}
                        ${
                          isActive
                            ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold"
                            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 font-medium"
                        }
                      `}
                    >
                      {heading.text}
                    </a>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}