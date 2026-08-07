"use client";

import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { useEffect, useRef } from "react";
import { BlogCard } from "./BlogCard";
import { useLocalSearch } from "./SearchContext";
import { FunctionReturnType } from "convex/server";

type PaginatedBlogsResponse = FunctionReturnType<typeof api.blogs.getPaginatedPostsByType>;

interface PageBlogPostsProps {
  initialBlogs: PaginatedBlogsResponse;
}

export function PageBlogPosts({ initialBlogs }: PageBlogPostsProps) {
  const { searchTerm, sortOrder, activeTags, feedType } = useLocalSearch();

  const dbPostType = (feedType === "team" || feedType === "community") ? feedType : undefined;
  const isPopularOnly = feedType === "popular" || undefined;

  // 1. Reactive live subscription using Convex's build-in pagination hook.
  // When active on the client, Convex automatically includes the logged-in user's
  // authentication identity to fetch live `isBookmarked` states.
  const { results, status, loadMore, isLoading: isQueryLoading } = usePaginatedQuery(
    api.blogs.getPaginatedPostsByType,
    {
      postType: dbPostType,
      isPopularOnly,
      searchTerm: searchTerm.trim() || undefined,
      activeTags: activeTags.length > 0 ? activeTags : undefined,
      sortOrder,
    },
    { initialNumItems: 6 }
  );

  // 2. Fallback to SSR static HTML (initialBlogs) until the live WebSocket populates `results`
  const blogs = results.length > 0 ? results : initialBlogs.page;
  const isDone = status === "Exhausted";
  const isLoading = status === "LoadingMore" || status === "LoadingFirstPage";

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 3. Infinite Scroll IntersectionObserver
  useEffect(() => {
    if (isDone || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && status === "CanLoadMore") {
          loadMore(6);
        }
      },
      { rootMargin: "200px" }
    );

    const currentTarget = loadMoreRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [isDone, isLoading, status, loadMore]);

  return (
    <div className="space-y-4 p-2">
      {blogs.length === 0 ? (
        <p className="text-muted-foreground">No insights posted yet.</p>
      ) : (
        <>
          <ul className="flex flex-col gap-2">
            {blogs.map((blog) => (
              <li key={blog._id}>
                <BlogCard
                  key={`${blog._id}-${blog.isBookmarked}`}
                  id={blog._id}
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
                  isInitialBookmarked={blog.isBookmarked}
                />
              </li>
            ))}
          </ul>

          {!isDone && (
            <div
              ref={loadMoreRef}
              className="py-6 text-center text-sm text-muted-foreground"
            >
              {isLoading ? "Loading more blogs..." : "Scroll down to load more"}
            </div>
          )}
        </>
      )}
    </div>
  );
}