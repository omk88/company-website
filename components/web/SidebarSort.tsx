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
          "flex h-8 shrink-0 items-center justify-between gap-2 rounded-lg border border-border/50 bg-background pl-3 pr-2 text-xs whitespace-nowrap placeholder:text-muted-foreground focus:ring-1 cursor-pointer",
          fullWidth ? "w-full" : "w-fit",
          className
        )}
      >
        <SelectValue placeholder="Sort order">
          {sortOrder === "new" && <span className="flex items-center gap-1.5"><CalendarArrowUp className="size-3.5" />New</span>}
          {sortOrder === "hot" && <span className="flex items-center gap-1.5"><Flame className="size-3.5" />Hot</span>}
          {sortOrder === "top" && <span className="flex items-center gap-1.5"><ArrowUp className="size-3.5" />Top</span>}
          {sortOrder === "controversial" && <span className="flex items-center gap-1.5"><Swords className="size-3.5" />Controversial</span>}
        </SelectValue>
      </SelectTrigger>
      
      <SelectContent position="popper">
        <SelectGroup>
          <SelectLabel>Sort</SelectLabel>
          <SelectItem value="new" className="text-xs cursor-pointer p-2"><CalendarArrowUp />New</SelectItem>
          <SelectItem value="hot" className="text-xs cursor-pointer p-2"><Flame />Hot</SelectItem>
          <SelectItem value="top" className="text-xs cursor-pointer p-2"><ArrowUp />Top</SelectItem>
          <SelectItem value="controversial" className="text-xs cursor-pointer p-2"><Swords />Controversial</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}