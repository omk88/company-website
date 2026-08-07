"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Bookmark } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Button } from "../ui/button";

interface BookmarkPostProps {
  blogId: Id<"blogs">;
  initialIsBookmarked: boolean;
}

export function BookmarkPost({ blogId, initialIsBookmarked }: BookmarkPostProps) {
  const [isPending, startTransition] = useTransition();
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);

  useEffect(() => {
    setIsBookmarked(initialIsBookmarked);
  }, [initialIsBookmarked]);

  const toggleBookmark = useMutation(api.blogs.toggleBookmark);

  const handleToggle = () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);

    startTransition(async () => {
      try {
        await toggleBookmark({ blogId });
      } catch (error) {
        setIsBookmarked(!nextState);
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
        className={`... ${isBookmarked ? "fill-current text-primary" : "fill-none"}`} 
      />
    </Button>
  );
}