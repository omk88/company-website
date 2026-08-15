"use client";

import { useEffect, useState } from "react";
import { EMOJI_REACTIONS } from "@/app/constants/reactions";
import { Badge } from "../ui/badge";
import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

interface BlogEmojiReactionsProps {
  initialBlog: Doc<"blogs">;
}

export function BlogEmojiReactions({ initialBlog }: BlogEmojiReactionsProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const liveReactions = useQuery(
    api.blogs.getBlogReactions,
    isMounted ? { blogId: initialBlog._id } : "skip"
  );

  const reactionsData = liveReactions ?? initialBlog;

  const hasReactions = EMOJI_REACTIONS.some(
    ({ field }) => ((reactionsData[field as keyof typeof reactionsData] ?? 0) as number) > 0
  );

  if (!hasReactions) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 min-h-[20px]">
      {EMOJI_REACTIONS.map(({ type, field, emoji, label }) => {
        const count = (reactionsData[field as keyof typeof reactionsData] ?? 0) as number;

        if (count === 0) return null;

        return (
          <Badge
            key={type}
            variant="secondary"
            className="flex items-center gap-1.5 py-1 text-md font-medium transition-all"
            title={label}
          >
            <span>{emoji}</span>
            <span className="text-muted-foreground">{count}</span>
          </Badge>
        );
      })}
    </div>
  );
}