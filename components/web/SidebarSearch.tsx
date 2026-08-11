"use client";

import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocalSearch } from "@/components/web/SearchContext";
import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";

interface SidebarSearchProps {
  placeholder: string;
  fullWidth?: boolean;
  showDropdown?: boolean;
}

export function SidebarSearch({
  placeholder,
  fullWidth = false,
  showDropdown = false,
}: SidebarSearchProps) {
  const { searchTerm, setSearchTerm, feedType } = useLocalSearch();
  const [localValue, setLocalValue] = useState(searchTerm);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(localValue);
    }, 200);

    return () => clearTimeout(timer);
  }, [localValue, setSearchTerm]);

  useEffect(() => {
    setLocalValue(searchTerm);
  }, [searchTerm]);

  const dbPostType =
    feedType === "team" || feedType === "community" ? feedType : undefined;

  const suggestions = useQuery(
    api.blogs.getSearchSuggestions,
    showDropdown && localValue.trim().length > 0
      ? { searchTerm: localValue.trim(), postType: dbPostType }
      : "skip"
  );

  const fullPlaceholder = `Search ${placeholder}…`;
  const rightPaddingClass = localValue ? "pr-8" : "pr-3";

  const handleFocus = () => {
    if (showDropdown && localValue.trim().length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <Popover
      open={
        isOpen &&
        showDropdown &&
        Boolean(localValue.trim()) &&
        suggestions !== undefined
      }
      onOpenChange={setIsOpen}
    >
      <PopoverAnchor asChild>
        <div className={`relative ${fullWidth ? "w-full" : "inline-block"}`}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 stroke-[1.5] text-muted-foreground pointer-events-none z-10" />

          <Input
            type="text"
            placeholder={fullPlaceholder}
            value={localValue}
            onChange={(e) => {
              const val = e.target.value;
              setLocalValue(val);
              if (showDropdown) {
                setIsOpen(val.trim().length > 0);
              }
            }}
            onFocus={handleFocus}
            className={`pl-9 ${rightPaddingClass} text-xs bg-background border-border/50 rounded-md focus-visible:ring-1 focus-visible:ring-primary ${
              fullWidth ? "w-full" : "w-auto [field-sizing:content]"
            }`}
          />

          {localValue && (
            <button
              onClick={() => {
                setLocalValue("");
                setSearchTerm("");
                setIsOpen(false);
              }}
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-sm hover:bg-muted z-10 cursor-pointer"
            >
              <X className="h-3.5 w-3.5 stroke-[2]" />
            </button>
          )}
        </div>
      </PopoverAnchor>

      {showDropdown && (
        <PopoverContent
          className="w-[400px] p-1 text-xs"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="space-y-0.5">
            {suggestions === undefined ? (
              <div className="flex items-center gap-2 px-2 py-2 text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Searching titles…</span>
              </div>
            ) : suggestions.length === 0 ? (
              <div className="px-2 py-2 text-muted-foreground italic">
                No matching titles found
              </div>
            ) : (
              suggestions.map((item) => (
                <div
                  key={item._id}
                  className="px-2 py-1.5 hover:bg-accent rounded-sm cursor-pointer truncate font-medium text-foreground transition-colors"
                  onClick={() => {
                    setLocalValue(item.title);
                    setSearchTerm(item.title);
                    setIsOpen(false);
                  }}
                >
                  <div className="group flex items-center gap-2.5 rounded-sm px-2.5 py-1.5 text-xs text-foreground/90 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors">
                    <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors stroke-[1.75]" />
                    <span className="truncate font-medium">
                      {item.title}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
}