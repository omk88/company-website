"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface ViewTrackerProps {
  postId: Id<"blogs">;
}

export function ViewTracker({ postId }: ViewTrackerProps) {
  const recordView = useMutation(api.blogs.recordView);
  const hasIncremented = useRef(false);

  useEffect(() => {
    const viewedKey = `viewed_${postId}`;
    if (sessionStorage.getItem(viewedKey)) return;

    if (!hasIncremented.current) {
      hasIncremented.current = true;
      
      sessionStorage.setItem(viewedKey, "true");
      
      recordView({ blogId: postId }).catch((err) =>
        console.error("Failed to record view event:", err)
      );
    }
  }, [postId, recordView]);

  return null;
}