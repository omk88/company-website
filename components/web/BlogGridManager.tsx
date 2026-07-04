"use client";

import { useEffect, useRef, useMemo } from "react";
import { BlogGrid } from "./BlogGrid";
import { BlogPostPreview } from "./BlogCard";
import { Frown } from "lucide-react";
import { useLocalSearch } from "@/components/web/SearchContext"; 
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const POSTS_PER_BATCH = 9;

interface BlogGridManagerProps {
  initialServerPosts: any[]; 
}

export function BlogGridManager({ initialServerPosts }: BlogGridManagerProps) {
  const { searchTerm, activeTags, sortOrder } = useLocalSearch();
  const observerTarget = useRef<HTMLDivElement>(null);

  const { results, status, loadMore } = usePaginatedQuery(
    api.blogs.getPaginatedPosts,
    {},
    { initialNumItems: POSTS_PER_BATCH }
  );

  const displayPosts = useMemo(() => {
    const activeResults = status === "LoadingFirstPage" ? initialServerPosts : results;

    let posts = [...activeResults] as BlogPostPreview[];

    if (activeTags.length > 0) {
      posts = posts.filter(post => 
        activeTags.every(tag => post.tags?.some((t: string) => t.toLowerCase() === tag.toLowerCase()))
      );
    }

    if (searchTerm) {
      const query = searchTerm.toLowerCase().trim();
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(query) || 
        (post.subtitle && post.subtitle.toLowerCase().includes(query))
      );
    }

    return posts.sort((a, b) => {
      if (sortOrder === "new") return b.createdAt - a.createdAt;
      if (sortOrder === "hot") return a.title.localeCompare(b.title);
      if (sortOrder === "top") return b.title.localeCompare(a.title);
      return b.createdAt - a.createdAt;
    });
  }, [results, status, initialServerPosts, searchTerm, activeTags, sortOrder]);

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
      { root: null, threshold: 0.1, rootMargin: "0px" }
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
            We couldn't find any articles matching your query. Try updating your filters in the sidebar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <BlogGrid initialPosts={displayPosts} />
      
      <div ref={observerTarget} className="w-full h-4 clear-both flex justify-center items-center mb-2 text-center">
        {(hasMore || isLoading || status === "LoadingFirstPage") && (
          <div className="text-sm font-mono text-muted-foreground animate-pulse py-2">
            Loading older insights...
          </div>
        )}
      </div>
    </div>
  );
}