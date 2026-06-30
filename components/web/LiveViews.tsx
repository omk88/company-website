"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Eye } from "lucide-react";

interface LiveViewsProps {
  postId: string;
  initialViews?: number;
}

export function LiveViews({ postId, initialViews = 0 }: LiveViewsProps) {
  const post = useQuery(api.blogs.getPostById, { postId: postId as Id<"blogs"> });

  const liveViews = post ? (post.views ?? 0) : initialViews;

  return (
    <h1 className="font-mono flex items-center justify-start gap-1 text-base md:text-s text-muted-foreground tracking-tight">
      <Eye className="w-4 h-4 stroke-[2.3] shrink-0 text-muted-foreground" />
      <span>{liveViews}</span>
    </h1>
  );
}