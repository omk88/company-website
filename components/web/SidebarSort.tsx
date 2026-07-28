"use client";

import { useLocalSearch } from "@/components/web/SearchContext";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUp, CalendarArrowUp, Flame, Swords } from "lucide-react";

export function SidebarSort() {
  const { sortOrder, setSortOrder } = useLocalSearch();

  return (
    <Select
      value={sortOrder}
      onValueChange={setSortOrder}
    >
      <SelectTrigger className="w-full text-xs bg-background border-border/50 focus:ring-1 cursor-pointer">
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