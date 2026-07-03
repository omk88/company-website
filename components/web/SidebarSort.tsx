"use client";

import { useEffect, useState } from "react";
import { useUpdateParams } from "@/hooks/use-update-search-params";
import { useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SidebarSort() {
  const { setParam } = useUpdateParams();
  const searchParams = useSearchParams();

  const [activeSort, setActiveSort] = useState(() => searchParams.get("sort") || "recent");

  useEffect(() => {
    setActiveSort(searchParams.get("sort") || "recent");
  }, [searchParams]);

  const handleSortChange = (val: string) => {
    setActiveSort(val);

    const event = new CustomEvent("local-sort-update", { detail: val });
    window.dispatchEvent(event);

    setParam("sort", val === "recent" ? null : val);
  };

  return (
    <Select
      value={activeSort}
      onValueChange={handleSortChange}
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