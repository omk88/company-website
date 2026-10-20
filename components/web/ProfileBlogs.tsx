"use client";

import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { useEffect, useRef } from "react";
import { BlogCard } from "./BlogCard";
import { EmptyState } from "./EmptyState";
import { CompactBlogCardSkeleton } from "./LoadingSkeletons/CompactBlogCardSkeleton";
import { FunctionReturnType } from "convex/server";
import { Library, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/app/ConvexClientProvider";
import Link from "next/link";

type ProfileData = FunctionReturnType<typeof api.profiles.getProfileByUsername>;

interface ProfileBlogsProps {
  profile: ProfileData;
  preloadedData?: any;
}

export function ProfileBlogs({ profile, preloadedData }: ProfileBlogsProps) {
  const userId = profile?.profile?.userId;

  const currentUser = useCurrentUser();
  const isAuthLoading = currentUser === undefined;
  const isOwnProfile = Boolean(
    currentUser?.userId &&
      profile?.profile?.userId &&
      currentUser.userId === profile.profile.userId
  );

  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.blogs.getPaginatedPostsByAuthor,
    userId ? { author: userId } : "skip",
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

  const hasPreloadedData = preloadedItems.length > 0;
  const isInitialLoading = isFirstLoad && displayResults.length === 0 && !hasPreloadedData;

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 w-full p-2">
      <div className="w-full mx-auto flex flex-col flex-1 h-full min-h-0">
        
        {(isInitialLoading || displayResults.length > 0) && (
          <div className="flex justify-between items-center mb-2 px-2">
            {isInitialLoading ? (
              <Skeleton className="h-6 w-16 rounded-lg" />
            ) : (
              <h3 className="text-sm font-medium bg-muted/80 px-2 p-0.5 rounded-lg text-zinc-500">
                Insights
              </h3>
            )}

            {isAuthLoading ? (
              <Skeleton className="h-6 w-20 rounded-full" />
            ) : isOwnProfile ? (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-11 md:h-6 rounded-full border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs text-zinc-700 dark:text-zinc-200 shadow-none transition-all flex items-center gap-2 px-2 cursor-pointer"
              >
                <Link href="/create-blog">
                  <Plus className="size-6 md:size-3.5 shrink-0 stroke-[2.5]" /> New Post
                </Link>
              </Button>
            ) : null}
          </div>
        )}

        {isInitialLoading ? (
          <ul className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <li key={i}>
                <CompactBlogCardSkeleton />
              </li>
            ))}
          </ul>
        ) : displayResults.length === 0 ? (
          <div className="flex flex-1 h-full w-full items-center">
            <EmptyState
              icon={Library}
              size="sm"
              title="No insights found"
              description="This user hasn't posted any insights yet."
              action={
                isOwnProfile ? (
                  <Button
                    asChild
                    variant="outline"
                    className="h-11 md:h-8 rounded-full border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs text-zinc-700 dark:text-zinc-200 shadow-none transition-all flex items-center gap-2 px-3.5 cursor-pointer"
                  >
                    <Link href="/create-blog">
                      <Plus className="h-4 w-4" /> New Post
                    </Link>
                  </Button>
                ) : undefined
              }
            />
          </div>
        ) : (
          <>
            <ul className="flex flex-col gap-2">
              {displayResults.map((blog: any) => (
                <li key={blog._id}>
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