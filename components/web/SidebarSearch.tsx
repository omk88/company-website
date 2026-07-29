"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocalSearch } from "@/components/web/SearchContext";
import { useState, useEffect } from "react";

interface SidebarSearchProps {
  placeholder: string;
}

export function SidebarSearch({ placeholder }: SidebarSearchProps) {
  const { searchTerm, setSearchTerm } = useLocalSearch();
  const [localValue, setLocalValue] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(localValue);
    }, 200);

    return () => clearTimeout(timer);
  }, [localValue, setSearchTerm]);

  useEffect(() => {
    setLocalValue(searchTerm);
  }, [searchTerm]);

  const fullPlaceholder = `Search ${placeholder}…`;
  const rightPaddingClass = localValue ? "pr-8" : "pr-3";

  return (
    <div className="relative inline-block">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 stroke-[1.5] text-muted-foreground pointer-events-none" />
      
      <Input
        type="text"
        placeholder={fullPlaceholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className={`pl-9 ${rightPaddingClass} text-xs w-auto [field-sizing:content] bg-background border-border/50 rounded-md focus-visible:ring-1 focus-visible:ring-primary`}
      />
      
      {localValue && (
        <button 
          onClick={() => setLocalValue("")} 
          type="button" 
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-sm hover:bg-muted"
        >
          <X className="h-3.5 w-3.5 stroke-[2]" />
        </button>
      )}
    </div>
  );
}