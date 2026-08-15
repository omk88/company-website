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
        className={cn(
          "flex h-9 shrink-0 items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white px-2.5 text-[13px] font-medium text-zinc-700 whitespace-nowrap hover:bg-zinc-50 focus:ring-1 focus:ring-zinc-400 cursor-pointer transition-colors",
          fullWidth ? "w-full" : "w-fit",
          className
        )}
      >
        <SelectValue placeholder="Sort order">
          {sortOrder === "new" && <span className="flex items-center gap-2"><CalendarArrowUp className="h-4 w-4 text-zinc-500" />New</span>}
          {sortOrder === "hot" && <span className="flex items-center gap-2"><Flame className="h-4 w-4 text-zinc-500" />Hot</span>}
          {sortOrder === "top" && <span className="flex items-center gap-2"><ArrowUp className="h-4 w-4 text-zinc-500" />Top</span>}
          {sortOrder === "controversial" && <span className="flex items-center gap-2"><Swords className="h-4 w-4 text-zinc-500" />Controversial</span>}
        </SelectValue>
      </SelectTrigger>
      
      <SelectContent position="popper" className="rounded-lg border-zinc-200 shadow-md">
        <SelectGroup>
          <SelectLabel className="px-2 py-1.5 text-xs text-zinc-500 font-semibold">Sort By</SelectLabel>
          <SelectItem value="new" className="text-[13px] text-zinc-700 cursor-pointer rounded-md my-0.5"><CalendarArrowUp className="h-4 w-4 mr-2 text-zinc-500" />New</SelectItem>
          <SelectItem value="hot" className="text-[13px] text-zinc-700 cursor-pointer rounded-md my-0.5"><Flame className="h-4 w-4 mr-2 text-zinc-500" />Hot</SelectItem>
          <SelectItem value="top" className="text-[13px] text-zinc-700 cursor-pointer rounded-md my-0.5"><ArrowUp className="h-4 w-4 mr-2 text-zinc-500" />Top</SelectItem>
          <SelectItem value="controversial" className="text-[13px] text-zinc-700 cursor-pointer rounded-md my-0.5"><Swords className="h-4 w-4 mr-2 text-zinc-500" />Controversial</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}