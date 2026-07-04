"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Eye, MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react";

interface LiveMetricsProps {
  postId: string;
  initialViews?: number;
  initialLikes?: number;
  initialDislikes?: number;
  initialMessages?: number;
}

export function LiveMetrics({ postId, initialViews = 0, initialLikes = 0, initialDislikes = 0 }: LiveMetricsProps) {
  const post = useQuery(api.blogs.getPostById, { postId: postId as Id<"blogs"> });
  const commentCount = useQuery(api.comments.getCommentNumber, { postId: postId as Id<"blogs"> });

  const { totalViews = initialViews, likes = initialLikes, dislikes = initialDislikes } = post ?? {};
  const comments = commentCount ?? 0;

  return (
    <div className="flex items-center gap-4 px-6 text-sm text-muted-foreground font-mono tracking-tight">
      <div className="flex items-center gap-1">
        <Eye className="w-4 h-4 stroke-[2.3] shrink-0" />
        <span>{totalViews}</span>
      </div>
      <div className="flex items-center gap-1">
        <ThumbsUp className="w-4 h-4 stroke-[2.3] shrink-0" />
        <span>{likes}</span>
      </div>
      <div className="flex items-center gap-1">
        <ThumbsDown className="w-4 h-4 stroke-[2.3] shrink-0" />
        <span>{dislikes}</span>
      </div>
      <div className="flex items-center gap-1">
        <MessageSquare className="w-4 h-4 stroke-[2.3] shrink-0" />
        <span>{comments}</span>
      </div>
    </div>
  );
}