"use client";

import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { useRef } from "react";
import { BlogCard } from "./BlogCard";
import { BlogEmptyState } from "./BlogEmptyState";
import { CompactBlogCardSkeleton } from "./LoadingSkeletons/CompactBlogCardSkeleton";

interface ProfileBookmarksProps {
  author: string | undefined;
}

export function ProfileBookmarks({ author }: ProfileBookmarksProps) {
  const { results, status } = usePaginatedQuery(
    api.blogs.getPaginatedBookmarkedPostsByUser,
    author ? { userId: author } : "skip",
    { initialNumItems: 6 }
  );

  const isFirstLoad = !author || status === "LoadingFirstPage";

  const lastResultsRef = useRef<any[]>([]);
  if (results.length > 0) {
    lastResultsRef.current = results;
  }

  const displayResults = results.length > 0 ? results : lastResultsRef.current;
  const loadMoreRef = useRef<HTMLDivElement>(null);

  if (isFirstLoad && displayResults.length === 0) {
    return (
      <div className="flex flex-col flex-1 h-full min-h-0 w-full">
        <ul className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <li key={i}>
              <CompactBlogCardSkeleton />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 w-full">
      {displayResults.length === 0 ? (
        <div className="flex flex-col flex-1 h-full min-h-0">
          <BlogEmptyState />
        </div>
      ) : (
        <>
          <ul className="flex flex-col gap-2">
            {displayResults.map((blog: any) => (
              <li key={blog._id}>
                <BlogCard
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
                  variant="compact"
                />
              </li>
            ))}
          </ul>

          <div ref={loadMoreRef} className="w-full" />
        </>
      )}
    </div>
  );
}