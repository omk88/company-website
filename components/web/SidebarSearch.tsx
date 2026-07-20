"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocalSearch } from "@/components/web/SearchContext";
import { useState, useEffect } from "react";

export function SidebarSearch() {
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

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 stroke-[1.5]" />
      
      <Input
        type="text"
        placeholder="Search insights..."
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="pl-9 pr-9 text-xs bg-background border-border/50 rounded-md focus-visible:ring-1 focus-visible:ring-primary w-full"
      />
      
      {localValue && (
        <button 
          onClick={() => setLocalValue("")} 
          type="button" 
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-sm hover:bg-muted"
        >
          <X className="h-3.5 w-3.5 stroke-[2]" />
        </button>
      )}
    </div>
  );
}