"use client";

import { useUpdateParams } from "@/hooks/use-update-search-params";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SidebarSortProps {
  currentSort: string;
}

export function SidebarSort({ currentSort }: SidebarSortProps) {
  const { setParam } = useUpdateParams();

  return (
    <Select
      value={currentSort}
      onValueChange={(val) => setParam("sort", val === "recent" ? null : val)}
    >
      <SelectTrigger className="w-full text-xs h-9 bg-background border-border/50 shadow-xs focus:ring-1 focus:ring-primary">
        <SelectValue placeholder="Sort order" />
      </SelectTrigger>
      <SelectContent className="bg-card border-border/50">
        <SelectItem value="recent" className="text-xs cursor-pointer">Most Recent</SelectItem>
        <SelectItem value="oldest" className="text-xs cursor-pointer">Least Recent</SelectItem>
        <SelectItem value="title-az" className="text-xs cursor-pointer">Title (A-Z)</SelectItem>
        <SelectItem value="title-za" className="text-xs cursor-pointer">Title (Z-A)</SelectItem>
      </SelectContent>
    </Select>
  );
}