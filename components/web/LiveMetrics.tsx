"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Eye, ThumbsDown, ThumbsUp } from "lucide-react";

interface LiveMetricsProps {
  postId: string;
  initialViews?: number;
  initialLikes?: number;
  initialDislikes?: number;
}

export function LiveMetrics({ postId, initialViews = 0, initialLikes = 0, initialDislikes = 0 }: LiveMetricsProps) {
  const post = useQuery(api.blogs.getPostById, { postId: postId as Id<"blogs"> });

  const { totalViews = initialViews, likes = initialLikes, dislikes = initialDislikes } = post ?? {};

  return (
    <div className="flex items-center gap-4 px-6">
      <h1 className="font-mono flex items-center justify-start gap-1 text-base md:text-s text-muted-foreground tracking-tight">
        <Eye className="w-4 h-4 stroke-[2.3] shrink-0 text-muted-foreground" />
        <span>{totalViews}</span>
      </h1>
      <h1 className="font-mono flex items-center justify-start gap-1 text-base md:text-s text-muted-foreground tracking-tight">
        <ThumbsUp className="w-4 h-4 stroke-[2.3] shrink-0 text-muted-foreground" />
        <span>{likes}</span>
      </h1>
      <h1 className="font-mono flex items-center justify-start gap-1 text-base md:text-s text-muted-foreground tracking-tight">
        <ThumbsDown className="w-4 h-4 stroke-[2.3] shrink-0 text-muted-foreground" />
        <span>{dislikes}</span>
      </h1>
    </div>
  );
}