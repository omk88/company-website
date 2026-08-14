"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchStore } from "@/stores/useSearchStore";
import { useState, useEffect } from "react";

interface SidebarSearchProps {
  placeholder: string;
  fullWidth?: boolean;
  showDropdown?: boolean;
}

export function SidebarSearch({
  placeholder,
  fullWidth = false,
}: SidebarSearchProps) {
  const searchTerm = useSearchStore((state) => state.searchTerm);
  const setSearchTerm = useSearchStore((state) => state.setSearchTerm);

  const [localValue, setLocalValue] = useState(searchTerm);

  useEffect(() => {
    setLocalValue(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (localValue === searchTerm) return;

    const timer = setTimeout(() => {
      setSearchTerm(localValue);
    }, 200);

    return () => clearTimeout(timer);
  }, [localValue, searchTerm, setSearchTerm]);

  const fullPlaceholder = `Search ${placeholder}…`;
  const rightPaddingClass = localValue ? "pr-8" : "pr-3";

  return (
    <div className={`relative ${fullWidth ? "w-full" : "inline-block"}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 stroke-[1.5] text-muted-foreground pointer-events-none z-10" />

      <Input
        type="text"
        placeholder={fullPlaceholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className={`pl-9 ${rightPaddingClass} text-xs bg-background border-border/50 rounded-md focus-visible:ring-1 focus-visible:ring-primary ${
          fullWidth ? "w-full" : "w-auto [field-sizing:content]"
        }`}
      />

      {localValue && (
        <button
          onClick={() => {
            setLocalValue("");
            setSearchTerm("");
          }}
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-sm hover:bg-muted z-10 cursor-pointer"
        >
          <X className="h-3.5 w-3.5 stroke-[2]" />
        </button>
      )}
    </div>
  );
}