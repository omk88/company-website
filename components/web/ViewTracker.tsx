"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface ViewTrackerProps {
  blogId: Id<"blogs">;
}

export function ViewTracker({ blogId }: ViewTrackerProps) {
  const recordView = useMutation(api.blogs.recordView);
  const hasIncremented = useRef(false);

  useEffect(() => {
    const viewedKey = `viewed_${blogId}`;
    if (sessionStorage.getItem(viewedKey)) return;

    if (!hasIncremented.current) {
      hasIncremented.current = true;
      
      sessionStorage.setItem(viewedKey, "true");
      
      recordView({ blogId: blogId }).catch((err) =>
        console.error("Failed to record view event:", err)
      );
    }
  }, [blogId, recordView]);

  return null;
}