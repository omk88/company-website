"use client";

import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { useRef } from "react";
import { BlogCard } from "./BlogCard";
import { EmptyState } from "./EmptyState";
import { CompactBlogCardSkeleton } from "./LoadingSkeletons/CompactBlogCardSkeleton";
import { cn } from "@/lib/utils";
import { Bookmark } from "lucide-react";
import { FunctionReturnType } from "convex/server";

type ProfileData = FunctionReturnType<typeof api.profiles.getProfileByUsername>;

interface ProfileBookmarksProps {
  profile: ProfileData;
}

export function ProfileBookmarks({ profile }: ProfileBookmarksProps) {
  const userId = profile?.profile?.userId;

  const { results, status } = usePaginatedQuery(
    api.blogs.getPaginatedBookmarkedPostsByUser,
    userId ? { userId: userId } : "skip",
    { initialNumItems: 6 }
  );

  const isFirstLoad = !userId || status === "LoadingFirstPage";

  const lastResultsRef = useRef<any[]>([]);
  if (results.length > 0) {
    lastResultsRef.current = results;
  }

  const displayResults = results.length > 0 ? results : lastResultsRef.current;
  const loadMoreRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 w-full">
      <div className="flex items-center justify-start gap-4 w-full border-b border-border mb-4">
        <div
          className={cn(
            "relative flex items-center gap-1.5 pb-2 pt-1.5 px-1 font-sans text-sm font-medium text-foreground",
            "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-current"
          )}
        >
          <Bookmark className="w-4 h-4 stroke-[2.3] shrink-0" />
          <span>{profile?.bookmarkCount ?? 0} Bookmarks Added</span>
        </div>
      </div>

      {isFirstLoad && displayResults.length === 0 ? (
        <ul className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <li key={i}>
              <CompactBlogCardSkeleton />
            </li>
          ))}
        </ul>
      ) : displayResults.length === 0 ? (
        <div className="flex flex-col flex-1 h-full min-h-0">
          <EmptyState size="sm" title="No bookmarked posts found" description="This user hasn't added any bookmarks yet." />
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