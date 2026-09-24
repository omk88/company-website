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

  React.useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -70% 0px" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (headings.length === 0) return null;

  const activeHeading = headings.find((h) => h.id === activeId);

  return (
    <div
      ref={dropdownRef}
      className="sticky top-13.5 md:top-16 z-40 w-full mb-8 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950"
    >
      <div className="relative max-w-none px-2">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="cursor-pointer flex items-center justify-between w-full py-3 text-sm text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2 overflow-hidden truncate pr-4">
            <span className="font-medium text-neutral-500 dark:text-neutral-400 shrink-0">
              On this page
            </span>
            {activeHeading && (
              <span className="font-semibold text-neutral-900 dark:text-white truncate">
                {activeHeading.text}
              </span>
            )}
          </div>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 border-t bg-white dark:bg-neutral-950 shadow-md">
            <ScrollArea className="h-64 p-3">
              <div className="space-y-1">
                {headings.map((heading) => {
                  const isActive = heading.id === activeId;
                  const indentClass =
                    heading.level === 1
                      ? "pl-0"
                      : heading.level === 2
                      ? "pl-3"
                      : heading.level === 3
                      ? "pl-6"
                      : "pl-9";

                  return (
                    <a
                      key={heading.id}
                      href={`#${heading.id}`}
                      onClick={() => setIsOpen(false)}
                      className={`block text-sm py-1 transition-colors rounded-sm ${indentClass} ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400 font-medium"
                          : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                      }`}
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