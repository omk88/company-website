"use client";

import { ChevronDown, Tag } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { useSearchStore } from "@/stores/useSearchStore";

const TAG_ITEMS = [
  { id: "all", label: "All Topics" },
  { id: "product", label: "Product" },
  { id: "research", label: "Research" },
  { id: "design", label: "Design" },
  { id: "technology", label: "Technology" },
  { id: "opinion", label: "Opinion" },
  { id: "tutorials", label: "Tutorials" },
];

interface SidebarTagsProps {
  fullWidth?: boolean;
  className?: string;
}

export function SidebarTags({ fullWidth, className }: SidebarTagsProps) {
  const activeTags = useSearchStore((state) => state.activeTags);
  const setActiveTags = useSearchStore((state) => state.setActiveTags);

  const isAllSelected = activeTags.length === 0 || activeTags.includes("all");

  const toggleTag = (id: string) => {
    if (id === "all") {
      setActiveTags([]);
      return;
    }

    setActiveTags((prev) => {
      const cleanPrev = prev.filter((t) => t !== "all");

      if (cleanPrev.includes(id)) {
        return cleanPrev.filter((t) => t !== id);
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
          className={cn(
            "flex h-9 shrink-0 items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white px-2.5 text-[13px] font-medium text-zinc-700 whitespace-nowrap hover:bg-zinc-50 focus:ring-1 focus:ring-zinc-400 cursor-pointer transition-colors",
            fullWidth ? "w-full" : "w-fit",
            className
          )}
        >
          <span className="flex flex-row items-center gap-2 whitespace-nowrap">
            <Tag className="h-4 w-4 shrink-0 text-zinc-500" />
            <span>Tags</span>
            {activeTags.length > 0 && !isAllSelected && (
              <span className="text-zinc-500 font-normal">({activeTags.length})</span>
            )}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400" />
        </button>
      </PopoverTrigger>

      <PopoverContent 
        align="start" 
        className="w-[var(--radix-popover-trigger-width)] min-w-[9rem] p-1.5 rounded-lg border-zinc-200 shadow-md"
      >
        <FieldGroup className="gap-0.5">
          <FieldLabel className="px-2 py-1 text-xs font-semibold text-zinc-500 select-none">
            Filter Tags
          </FieldLabel>

          {TAG_ITEMS.map((item) => (
            <Field
              key={item.id}
              orientation="horizontal"
              className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-zinc-100 cursor-pointer transition-colors select-none"
              onClick={() => toggleTag(item.id)}
            >
              <Checkbox
                id={item.id}
                name={item.id}
                checked={isChecked(item.id)}
                className="pointer-events-none rounded border-zinc-300"
                tabIndex={-1}
              />
              <FieldLabel
                className="font-normal cursor-pointer select-none pointer-events-none"
              >
                <span className="text-[13px] text-zinc-700">{item.label}</span>
              </FieldLabel>
            </Field>
          ))}
        </FieldGroup>
      </PopoverContent>
    </Popover>
  );
}