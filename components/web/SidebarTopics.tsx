"use client";

import { Toggle } from "@/components/ui/toggle";
import { useLocalSearch } from "@/components/web/SearchContext";

const AVAILABLE_TAGS = ["Tutorials", "Research", "Design", "Technology", "Product", "Opinion"];

export function SidebarTopics() {
  const { activeTags, setActiveTags } = useLocalSearch();

  const handleTagToggle = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Toggle
        variant="outline"
        size="sm"
        pressed={activeTags.length === 0}
        onPressedChange={() => setActiveTags([])}
        className="w-full justify-start text-xs h-9 px-3 border-border/50 bg-background hover:bg-muted data-[state=on]:bg-black data-[state=on]:text-white dark:data-[state=on]:bg-white dark:data-[state=on]:text-black transition-colors cursor-pointer font-medium"
      >
        All Posts
      </Toggle>

      {AVAILABLE_TAGS.map((tag) => (
        <Toggle
          key={tag}
          variant="outline"
          size="sm"
          pressed={activeTags.includes(tag)}
          onPressedChange={() => handleTagToggle(tag)}
          className="w-full justify-start text-xs h-9 px-3 border-border/50 bg-background hover:bg-muted data-[state=on]:bg-black data-[state=on]:text-white dark:data-[state=on]:bg-white dark:data-[state=on]:text-black transition-colors cursor-pointer font-medium"
        >
          {tag}
        </Toggle>
      ))}
    </div>
  );
}