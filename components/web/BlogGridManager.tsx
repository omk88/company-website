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

  const lastValidPosts = useRef<BlogPostPreview[]>(initialServerPosts);
  
  const wasLastStateEmpty = useRef<boolean>(false);
  
  const isLoadingFirstPage = status === "LoadingFirstPage";

  if (!isLoadingFirstPage && results !== undefined) {
    lastValidPosts.current = results as BlogPostPreview[];
    wasLastStateEmpty.current = results.length === 0;
  }

  const showEmptyState = isLoadingFirstPage ? wasLastStateEmpty.current : (results?.length === 0);
  const displayPosts = isLoadingFirstPage ? lastValidPosts.current : (results as BlogPostPreview[]);

  const hasMore = status === "CanLoadMore";
  const isLoadingMore = status === "LoadingMore";

  useEffect(() => {
    if (!hasMore || isLoadingMore) return;

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
  }, [hasMore, isLoadingMore, loadMore]);

  return (
    <div className="w-full">
      {showEmptyState ? (
        <div className="w-full py-20 flex flex-col items-center justify-center text-muted-foreground gap-3 text-center max-w-sm mx-auto px-4">
          <Frown className="h-8 w-8 stroke-[1.2] text-muted-foreground/60" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">No matches found</p>
            <p className="text-xs text-muted-foreground/80 leading-relaxed">
              We couldn't find any articles matching your query. Try updating your filters.
            </p>
          </div>
        </div>
      ) : (
        <BlogGrid initialPosts={displayPosts} />
      )}
      
      <div ref={observerTarget} className="w-full min-h-[60px] flex justify-center items-center my-4 text-center">
        {isLoadingMore && (
          <div className="text-sm font-mono text-muted-foreground py-2">
            Loading older insights...
          </div>
        )}
      </div>
    </div>
  );
}