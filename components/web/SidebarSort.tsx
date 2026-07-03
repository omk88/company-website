"use client";

import { useLocalSearch } from "@/components/web/SearchContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        <SelectItem value="recent" className="text-xs cursor-pointer">Most Recent</SelectItem>
        <SelectItem value="oldest" className="text-xs cursor-pointer">Least Recent</SelectItem>
        <SelectItem value="title-az" className="text-xs cursor-pointer">Title (A-Z)</SelectItem>
        <SelectItem value="title-za" className="text-xs cursor-pointer">Title (Z-A)</SelectItem>
      </SelectContent>
    </Select>
  );
}