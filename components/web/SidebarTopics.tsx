"use client";

import { useEffect, useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { useUpdateParams } from "@/hooks/use-update-search-params";
import { useSearchParams } from "next/navigation";

const AVAILABLE_TAGS = ["Tutorials", "Research", "Design", "Technology", "Product", "Opinion"];

export function SidebarTopics() {
  const { setParam } = useUpdateParams();
  const searchParams = useSearchParams();

  const [activeTags, setActiveTags] = useState<string[]>(() => {
    const currentTags = searchParams.get("tags") || "";
    return currentTags ? currentTags.split(",") : [];
  });

  useEffect(() => {
    const currentTags = searchParams.get("tags") || "";
    setActiveTags(currentTags ? currentTags.split(",") : []);
  }, [searchParams]);

  const dispatchLocalUpdate = (tags: string[]) => {
    setActiveTags(tags);
    const event = new CustomEvent("local-tags-update", { detail: tags });
    window.dispatchEvent(event);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setParam("tags", activeTags.length ? activeTags.join(",") : null);
    }, 350);
    return () => clearTimeout(timer);
  }, [activeTags]);

  const handleTagToggle = (tag: string) => {
    let nextTags = [...activeTags];
    if (nextTags.includes(tag)) {
      nextTags = nextTags.filter((t) => t !== tag);
    } else {
      nextTags.push(tag);
    }
    dispatchLocalUpdate(nextTags);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Toggle
        variant="outline"
        size="sm"
        pressed={activeTags.length === 0}
        onPressedChange={() => dispatchLocalUpdate([])}
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