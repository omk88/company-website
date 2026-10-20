"use client";

import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { useEffect, useRef } from "react";
import { BlogCard } from "@/components/web/BlogCard";
import { EmptyState } from "@/components/web/EmptyState";
import { CompactBlogCardSkeleton } from "@/components/web/LoadingSkeletons/CompactBlogCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Library } from "lucide-react";

interface SeriesItemsProps {
  slug: string;
  preloadedData?: any;
}

export function SeriesItems({ slug, preloadedData }: SeriesItemsProps) {
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.series.getPaginatedSeriesItemsBySlug,
    slug ? { slug } : "skip",
    { initialNumItems: 7 }
  );

  const isFirstLoad = status === "LoadingFirstPage";
  const canLoadMore = status === "CanLoadMore";

  const lastResultsRef = useRef<any[]>([]);
  if (results.length > 0) {
    lastResultsRef.current = results;
  }

  const preloadedItems = Array.isArray(preloadedData)
    ? preloadedData
    : preloadedData?.page ?? [];

  const displayResults =
    results.length > 0
      ? results
      : isFirstLoad && preloadedItems.length > 0
      ? preloadedItems
      : lastResultsRef.current;

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && canLoadMore) {
          loadMore(7);
        }
      },
      { rootMargin: "200px" }
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [canLoadMore, loadMore]);

  return (
    <div className="w-full p-2">
      <div className="w-full mx-auto">
        {isFirstLoad && displayResults.length === 0 ? (
          <ul className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <li key={i} className="flex flex-col gap-1.5">
                <Skeleton className="h-3 w-12 rounded bg-muted/60" />
                <CompactBlogCardSkeleton />
              </li>
            ))}
          </ul>
        ) : displayResults.length === 0 ? (
          <div className="flex flex-1 h-full w-full items-center">
            <EmptyState
              icon={Library}
              size="sm"
              description="There are no articles in this series yet."
            />
          </div>
        ) : (
          <>
            <ul className="flex flex-col gap-4">
              {displayResults.map((blog: any, index: number) => (
                <li key={blog._id} className="flex flex-col gap-1.5">
                  {/* Part Header */}
                  <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase px-1">
                    Part {index + 1}
                  </span>

                  <BlogCard
                    id={blog._id}
                    blogTitleId={blog.blogTitleId}
                    imageUrl={blog.imageUrl}
                    displayName={blog.displayName}
                    username={blog.username}
                    title={blog.title}
                    subtitle={blog.subtitle}
                    totalViews={blog.totalViews}
                    likes={blog.likes}
                    commentCount={blog.commentCount}
                    date={blog._creationTime}
                    readTime={blog.readTime}
                    tags={blog.tags}
                    variant="compact"
                  />
                </li>
              ))}
            </ul>

            <div ref={loadMoreRef} className="w-full">
              {isLoading && status === "LoadingMore" && (
                <div className="py-4 flex justify-center">
                  <CompactBlogCardSkeleton />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}