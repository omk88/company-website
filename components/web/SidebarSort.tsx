"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUp, CalendarArrowUp, Flame, Swords } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchStore } from "@/stores/useSearchStore";

interface SidebarSortProps {
  fullWidth?: boolean;
  className?: string;
}

export function SidebarSort({ fullWidth = false, className }: SidebarSortProps) {
  const sortOrder = useSearchStore((state) => state.sortOrder);
  const setSortOrder = useSearchStore((state) => state.setSortOrder);

  return (
    <Select
      value={sortOrder}
      onValueChange={setSortOrder}
    >
      <SelectTrigger
        chevronClassName="text-zinc-500 dark:text-zinc-400 h-4 w-4 md:h-4 md:w-4" 
        className={cn(
          "flex h-9 md:h-9 shrink-0 items-center justify-between gap-1.5 md:gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white px-2 md:px-2.5 text-xs md:text-[13px] font-medium text-zinc-700 whitespace-nowrap hover:bg-zinc-50 focus:ring-1 focus:ring-zinc-400 cursor-pointer transition-colors leading-none",
          fullWidth ? "w-full" : "w-fit",
          className
        )}
      >
        <SelectValue placeholder="Sort order">
          {sortOrder === "new" && (
            <span className="flex items-center gap-1.5 md:gap-2 text-zinc-500">
              <CalendarArrowUp className="h-4 w-4 md:h-4 md:w-4 shrink-0" />
              <span>New</span>
            </span>
          )}
          {sortOrder === "hot" && (
            <span className="flex items-center gap-1.5 md:gap-2 text-zinc-500">
              <Flame className="h-4 w-4 md:h-4 md:w-4 shrink-0" />
              <span>Hot</span>
            </span>
          )}
          {sortOrder === "top" && (
            <span className="flex items-center gap-1.5 md:gap-2 text-zinc-500">
              <ArrowUp className="h-4 w-4 md:h-4 md:w-4 shrink-0" />
              <span>Top</span>
            </span>
          )}
          {sortOrder === "controversial" && (
            <span className="flex items-center gap-1.5 md:gap-2 text-zinc-500">
              <Swords className="h-4 w-4 md:h-4 md:w-4 shrink-0" />
              <span>Controversial</span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      
      <SelectContent position="popper" className="rounded-lg border-zinc-200 shadow-md">
        <SelectGroup>
          <SelectLabel className="px-2 py-1.5 text-xs text-zinc-500 font-semibold">Sort By</SelectLabel>
          <SelectItem value="new" className="text-sm text-zinc-700 cursor-pointer rounded-md my-0.5">
            <CalendarArrowUp className="h-4 w-4 mr-2 text-zinc-500" />
            New
          </SelectItem>
          <SelectItem value="hot" className="text-sm text-zinc-700 cursor-pointer rounded-md my-0.5">
            <Flame className="h-4 w-4 mr-2 text-zinc-500" />
            Hot
          </SelectItem>
          <SelectItem value="top" className="text-sm text-zinc-700 cursor-pointer rounded-md my-0.5">
            <ArrowUp className="h-4 w-4 mr-2 text-zinc-500" />
            Top
          </SelectItem>
          <SelectItem value="controversial" className="text-sm text-zinc-700 cursor-pointer rounded-md my-0.5">
            <Swords className="h-4 w-4 mr-2 text-zinc-500" />
            Controversial
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}