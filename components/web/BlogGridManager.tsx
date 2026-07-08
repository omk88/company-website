"use client";

import { useEffect, useRef, useState } from "react";
import { BlogGrid } from "./BlogGrid";
import { BlogPostPreview } from "./BlogCard";
import { Frown } from "lucide-react";
import { useLocalSearch } from "@/components/web/SearchContext"; 
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

const POSTS_PER_BATCH = 9;

interface BlogGridManagerProps {
  initialServerPosts: BlogPostPreview[]; 
  disableSearch?: boolean;
}

function useSafeSearch(disableSearch: boolean) {
  if (disableSearch) {
    return { searchTerm: "", activeTags: [], sortOrder: "desc" };
  }

  try {
    return useLocalSearch();
  } catch (error) {
    return { searchTerm: "", activeTags: [], sortOrder: "desc" };
  }
}

export function BlogGridManager({ initialServerPosts, disableSearch = false }: BlogGridManagerProps) {
  const { searchTerm, activeTags, sortOrder } = useSafeSearch(disableSearch);
  const observerTarget = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState("team");

  const { results, status, loadMore } = usePaginatedQuery(
    api.blogs.getPaginatedPosts,
    { 
      searchTerm: !disableSearch && searchTerm ? searchTerm : undefined, 
      activeTags: !disableSearch && activeTags.length > 0 ? activeTags : undefined,
      sortOrder: sortOrder
    },
    { initialNumItems: POSTS_PER_BATCH }
  );

  const displayPosts = (results.length > 0 || status !== "LoadingFirstPage") 
    ? (results as BlogPostPreview[]) 
    : initialServerPosts;

  const showEmptyState = status === "Exhausted" && displayPosts.length === 0;

  useEffect(() => {
    const currentTarget = observerTarget.current;
    if (!currentTarget) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && status === "CanLoadMore") {
          loadMore(POSTS_PER_BATCH);
        }
      },
      { 
        root: null, 
        threshold: 0.1,
        rootMargin: "0px 0px 150px 0px" 
      } 
    );

    observer.observe(currentTarget);
    return () => observer.unobserve(currentTarget);
  }, [status, loadMore]); 

  if (showEmptyState) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center text-muted-foreground gap-3 text-center max-w-sm mx-auto px-4">
        <Frown className="h-8 w-8 stroke-[1.2]" />
        <p className="text-sm font-semibold text-foreground">No matches found</p>
      </div>
    );
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="w-full">
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="flex w-max gap-1 p-1">
            <TabsTrigger value="team" className="flex items-center gap-1.5 px-4 whitespace-nowrap">
              <span>Team</span>
            </TabsTrigger>
            
            <TabsTrigger value="community" className="flex items-center gap-1.5 px-4 whitespace-nowrap">
              <span>Community</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <BlogGrid initialPosts={displayPosts} />
      
      <div ref={observerTarget} className="w-full h-4 clear-both text-transparent" aria-hidden="true" />

      {status === "LoadingMore" && (
        <div className="w-full text-center text-sm font-mono text-muted-foreground py-4">
          Loading older insights...
        </div>
      )}
    </div>
  );
}