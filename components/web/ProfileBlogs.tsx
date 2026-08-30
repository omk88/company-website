"use client";

import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { useRef } from "react";
import { BlogCard } from "./BlogCard";
import { EmptyState } from "./EmptyState";
import { CompactBlogCardSkeleton } from "./LoadingSkeletons/CompactBlogCardSkeleton";
import { FunctionReturnType } from "convex/server";

type ProfileData = FunctionReturnType<typeof api.profiles.getProfileByUsername>;

interface ProfileBlogsProps {
  profile: ProfileData;
}

export function ProfileBlogs({ profile }: ProfileBlogsProps) {
  const userId = profile?.profile?.userId;

  const { results, status } = usePaginatedQuery(
    api.blogs.getPaginatedPostsByAuthor,
    userId ? { author: userId } : "skip",
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
    <div className="flex flex-col flex-1 h-full min-h-0 w-full mt-2">
      <div className="w-full max-w-2xl mx-auto px-6 flex-1">
        {isFirstLoad && displayResults.length === 0 ? (
          <ul className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <li key={i}>
                <CompactBlogCardSkeleton />
              </li>
            ))}
          </ul>
        ) : displayResults.length === 0 ? (
          <div className="flex flex-col flex-1 h-full min-h-0 items-center justify-center">
            <EmptyState size="sm" description="This user hasn't posted any insights yet." />
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
    </div>
  );
}