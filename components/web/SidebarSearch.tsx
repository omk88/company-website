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

  return (
    <div 
      className={`
        group flex items-center bg-white dark:bg-zinc-900 
        border border-zinc-200 dark:border-zinc-800 rounded-md md:rounded-lg 
        px-2.5 md:px-3 h-7 md:h-9 
        focus-within:ring-1 focus-within:ring-zinc-400 transition-colors
        md:w-full ${fullWidth ? "w-full flex-1 min-w-0" : "w-auto"}
      `}
    >
      <Search className="h-3.5 w-3.5 md:h-4 md:w-4 text-zinc-400 md:text-zinc-500 shrink-0 mr-2 translate-y-[0.5px]" />

      <Input
        iconCentered
        type="text"
        placeholder={fullPlaceholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="h-full border-0 bg-transparent px-0 text-xs md:text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 md:placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:border-0 shadow-none w-full flex-1 min-w-0"
      />

      {localValue && (
        <button
          onClick={() => {
            setLocalValue("");
            setSearchTerm("");
          }}
          type="button"
          className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer ml-1 shrink-0"
        >
          <X className="h-3 w-3 md:h-3.5 md:w-3.5 stroke-[2]" />
        </button>
      )}
    </div>
  );
}