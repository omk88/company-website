"use client";

import { useLocalSearch } from "@/components/web/SearchContext";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUp, CalendarArrowUp, Flame, Swords } from "lucide-react";

export function SidebarSort() {
  const { sortOrder, setSortOrder } = useLocalSearch();

  return (
    <Select
      value={sortOrder}
      onValueChange={setSortOrder}
    >
      <SelectTrigger className="w-full text-xs h-9 bg-background border-border/50 shadow-xs focus:ring-1 focus:ring-primary">
        <SelectValue placeholder="Sort order" />
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