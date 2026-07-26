"use client";

import { ChevronDown, Tag } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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

      const cleanPrev = prev.filter((t) => t !== "all");
      const currentWithoutAll = prev.filter((t) => t !== "all");

      if (cleanPrev.includes(id)) {
        const updated = cleanPrev.filter((t) => t !== id);
        return updated;
      } else {
        return [...cleanPrev, id];
      }
    });
  };

  const isChecked = (id: string) => {
    if (id === "all") return isAllSelected;
    return !isAllSelected && activeTags.includes(id);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-8 w-fit shrink-0 items-center justify-between gap-2 rounded-lg border border-border/50 bg-background pl-3 pr-2 text-xs whitespace-nowrap placeholder:text-muted-foreground focus:ring-1"
        >
          <span className="flex flex-row items-center gap-1.5 whitespace-nowrap">
            <Tag className="h-3.5 w-3.5 shrink-0" />
            <span>Tags</span>
            {activeTags.length > 0 && !isAllSelected && (
              <span className="text-muted-foreground">({activeTags.length})</span>
            )}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>

      <PopoverContent 
        align="end" 
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