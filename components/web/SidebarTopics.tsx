"use client";

import { Toggle } from "@/components/ui/toggle";
import { useUpdateParams } from "@/hooks/use-update-search-params";

const AVAILABLE_TAGS = ["Tutorials", "Research", "Design", "Technology", "Product", "Opinion"];

interface SidebarTopicsProps {
  currentTags: string;
}

export function SidebarTopics({ currentTags }: SidebarTopicsProps) {
  const { setParam } = useUpdateParams();
  
  const activeTags = currentTags ? currentTags.split(",") : [];

  const handleTagToggle = (tag: string) => {
    let nextTags = [...activeTags];
    if (nextTags.includes(tag)) {
      nextTags = nextTags.filter((t) => t !== tag);
    } else {
      nextTags.push(tag);
    }
    setParam("tags", nextTags.length ? nextTags.join(",") : null);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Toggle
        variant="outline"
        size="sm"
        pressed={activeTags.length === 0}
        onPressedChange={() => setParam("tags", null)}
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