"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Bookmark } from "lucide-react";
import { useTransition } from "react";
import { Button } from "../ui/button";

interface BookmarkPostProps {
  blogId: Id<"blogs">;
}

export function BookmarkPost({ blogId }: BookmarkPostProps) {
  const [isPending, startTransition] = useTransition();

  const blogState = useQuery(api.blogs.getBlogBookmarkedState, { blogId });
  const isBookmarked = blogState?.isBookmarked ?? false;

  const toggleBookmarkMutation = useMutation(api.blogs.toggleBookmark)
    .withOptimisticUpdate((localStore, args) => {
      const previous = localStore.getQuery(api.blogs.getBlogBookmarkedState, { blogId });
      
      if (previous !== undefined) {
        localStore.setQuery(
          api.blogs.getBlogFeaturedState,
          { blogId },
          {
            ...previous,
            isFeatured: !previous?.isBookmarked,
          }
        );
      }
    });

  const handleToggle = () => {
    startTransition(async () => {
      await toggleBookmarkMutation({ blogId });
    });
  };

  return (
    <div>
      <Button 
        variant="ghost"
        disabled={isPending || blogState === undefined}
        onClick={handleToggle}
        className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground pointer-events-auto cursor-pointer"
      >
        <Bookmark 
          className={`w-4 h-4 stroke-[2.3] transition-colors ${
            isBookmarked ? "fill-current text-primary" : "fill-none"
          }`} 
        />
      </Button>
    </div>
  );
}