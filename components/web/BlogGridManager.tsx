"use client";

import { useEffect, useRef } from "react";
import { BlogGrid } from "./BlogGrid";
import { BlogPostPreview } from "./BlogCard";
import { Frown } from "lucide-react";
import { useLocalSearch } from "@/components/web/SearchContext"; 
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const POSTS_PER_BATCH = 9;

interface BlogGridManagerProps {
  initialServerPosts: BlogPostPreview[]; 
}

export function BlogGridManager({ initialServerPosts }: BlogGridManagerProps) {
  const { searchTerm, activeTags, sortOrder } = useLocalSearch();
  const observerTarget = useRef<HTMLDivElement>(null);

  const { results, status, loadMore } = usePaginatedQuery(
    api.blogs.getPaginatedPosts,
    { 
      searchTerm: searchTerm || undefined, 
      activeTags: activeTags.length > 0 ? activeTags : undefined,
      sortOrder: sortOrder
    },
    { initialNumItems: POSTS_PER_BATCH }
  );

  const isFilteringOrSearching = searchTerm !== "" || activeTags.length > 0;

  const displayPosts = (status === "LoadingFirstPage" && !isFilteringOrSearching)
    ? initialServerPosts 
    : (results as BlogPostPreview[]);

  const hasMore = status === "CanLoadMore";
  const isLoading = status === "LoadingMore";

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore(POSTS_PER_BATCH);
        }
      },
      { root: null, threshold: 0.1, rootMargin: "200px" } 
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [hasMore, isLoading, loadMore]);

  if (displayPosts.length === 0 && status === "Exhausted") {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center text-muted-foreground gap-3 text-center max-w-sm mx-auto px-4">
        <Frown className="h-8 w-8 stroke-[1.2] text-muted-foreground/60" />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">No matches found</p>
          <p className="text-xs text-muted-foreground/80 leading-relaxed">
            We couldn't find any articles matching your query. Try updating your filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <BlogGrid initialPosts={displayPosts} />
      
      <div ref={observerTarget} className="w-full min-h-[60px] flex justify-center items-center my-4 text-center">
        {isLoading && (
          <div className="text-sm font-mono text-muted-foreground animate-pulse py-2">
            Loading older insights...
          </div>
        )}
      </div>
    </div>
  );
}