"use client";

import { useState, useEffect, useRef } from "react";
import { BlogGrid } from "./BlogGrid";
import { BlogPostPreview } from "./BlogCard";
import { Frown } from "lucide-react";

const POSTS_PER_BATCH = 9;

interface BlogGridManagerProps {
  allPosts: BlogPostPreview[];
}

export function BlogGridManager({ allPosts }: BlogGridManagerProps) {
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_BATCH);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(POSTS_PER_BATCH);
  }, [allPosts]);

  const hasMore = visibleCount < allPosts.length;

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + POSTS_PER_BATCH, allPosts.length));
        }
      },
      { 
        root: null,    
        threshold: 0.1, 
        rootMargin: "0px"
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, allPosts.length]);

  const visiblePosts = allPosts.slice(0, visibleCount);

  if (allPosts.length === 0) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center text-muted-foreground gap-3 text-center max-w-sm mx-auto px-4">
        <Frown className="h-8 w-8 stroke-[1.2] text-muted-foreground/60" />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">No matches found</p>
          <p className="text-xs text-muted-foreground/80 leading-relaxed">
            We couldn't find any articles matching your query. Try updating your filters in the sidebar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <BlogGrid initialPosts={visiblePosts} />

      <div 
        ref={observerTarget} 
        className="w-full h-4 clear-both flex justify-center items-center mb-2 text-center"
      >
        {hasMore && (
          <div className="text-sm font-mono text-muted-foreground animate-pulse py-2">
            Loading older insights...
          </div>
        )}
      </div>
    </div>
  );
}