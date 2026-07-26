"use client";

import { useState } from "react";
import { ChevronDown, Tag } from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Checkbox } from "../ui/checkbox";
import { useLocalSearch } from "./SearchContext";

const TAG_ITEMS = [
  { id: "all", label: "All Topics" },
  { id: "product", label: "Product" },
  { id: "research", label: "Research" },
  { id: "design", label: "Design" },
  { id: "technology", label: "Technology" },
  { id: "opinion", label: "Opinion" },
  { id: "tutorials", label: "Tutorials" },
];

export function SidebarTags() {
  const { activeTags, setActiveTags } = useLocalSearch();

  const isAllSelected = activeTags.length === 0 || activeTags.includes("all");

  const toggleTag = (id: string) => {
    if (id === "all") {
      setActiveTags([]);
      return;
    }

    setActiveTags((prev) => {
      const currentWithoutAll = prev.filter((t) => t !== "all");

      if (currentWithoutAll.includes(id)) {
        const updated = currentWithoutAll.filter((t) => t !== id);
        return updated;
      } else {
        return [...currentWithoutAll, id];
      }
    });
  };

  const isChecked = (id: string) => {
    if (id === "all") return isAllSelected;
    if (isAllSelected) return true;
    return activeTags.includes(id);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex gap-2 h-8 w-full items-center justify-between rounded-lg border border-border/50 bg-background pl-3 pr-2 text-xs placeholder:text-muted-foreground focus:ring-1"
        >
          <span className="flex flex-row items-center gap-2">
            <Tag className="h-3.5 w-3.5" />
            Tags { activeTags.length > 0 && !isAllSelected ? `(${activeTags.length})` : "" }
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
      </PopoverTrigger>

      <PopoverContent 
        align="start" 
        className="w-[var(--radix-popover-trigger-width)] min-w-[8rem] p-0"
      >
        <FieldGroup className="gap-1 p-2">
          <FieldLabel className="px-2 text-xs font-medium text-muted-foreground select-none">
            Tags
          </FieldLabel>

          {TAG_ITEMS.map((item) => (
            <Field
              key={item.id}
              orientation="horizontal"
              className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors select-none"
              onClick={() => toggleTag(item.id)}
            >
              <Checkbox
                id={item.id}
                name={item.id}
                checked={isChecked(item.id)}
                onCheckedChange={() => toggleTag(item.id)}
              />
              <FieldLabel
                htmlFor={item.id}
                className="font-normal cursor-pointer select-none"
              >
                <span className="!text-xs">{item.label}</span>
              </FieldLabel>
            </Field>
          ))}
        </FieldGroup>
      </PopoverContent>
    </Popover>
  );
}