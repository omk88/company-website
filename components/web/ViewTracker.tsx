"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface ViewTrackerProps {
  postId: Id<"blogs">;
}

export function ViewTracker({ postId }: ViewTrackerProps) {
  const incrementViews = useMutation(api.blogs.incrementViews);
  const hasIncremented = useRef(false);

  useEffect(() => {
    const viewedKey = `viewed_${postId}`;
    if (sessionStorage.getItem(viewedKey)) return;

    if (!hasIncremented.current) {
      hasIncremented.current = true;
      
      sessionStorage.setItem(viewedKey, "true");
      
      incrementViews({ postId }).catch((err) =>
        console.error("Failed to increment views:", err)
      );
    }
  }, [postId, incrementViews]);

  return null;
}