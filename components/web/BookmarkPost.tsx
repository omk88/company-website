"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Bookmark } from "lucide-react";
import { useTransition } from "react";
import { Button } from "../ui/button";
import { useBookmarks } from "@/providers/BookmarksProvider";
import { toast } from "sonner";

interface BookmarkPostProps {
  blogId: Id<"blogs">;
}

export function BookmarkPost({ blogId }: BookmarkPostProps) {
  const [isPending, startTransition] = useTransition();
  const toggleBookmark = useMutation(api.blogs.toggleBookmark);

  const { isBookmarked } = useBookmarks();
  const bookmarked = isBookmarked(blogId);

  const handleToggle = () => {
    startTransition(async () => {
      try {
        await toggleBookmark({ blogId });
      } catch (error) {
        toast.error("Failed to update bookmark status.");
      }
    });
  };

  return (
    <Button 
      variant="ghost"
      disabled={isPending}
      onClick={handleToggle}
      className="..."
    >
      <Bookmark 
        className={`... ${
          bookmarked ? "fill-current text-primary" : "fill-none text-muted-foreground"
        }`} 
      />
    </Button>
  );
}