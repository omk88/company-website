"use client";

import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { useEffect, useRef, useState } from "react";
import SeriesCard from "./SeriesCard";
import { Doc } from "@/convex/_generated/dataModel";
import { FunctionReturnType } from "convex/server";
import { CompactSeriesCardSkeleton } from "@/components/web/LoadingSkeletons/CompactSeriesCardSkeleton";
import { EmptyState } from "@/components/web/EmptyState";
import { List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateSeriesDialog } from "./CreateSeriesDialog";
import { useCurrentUser } from "@/app/ConvexClientProvider";
import VideoCard from "./VideoCard";

type ProfileData = FunctionReturnType<typeof api.profiles.getProfileByUsername>;

interface ProfileVideosProps {
  profile: ProfileData;
  preloadedData?: any;
}

export function ProfileVideos({ profile, preloadedData }: ProfileVideosProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const userId = profile?.profile?.userId;

  const currentUser = useCurrentUser();
  const isOwnProfile = Boolean(currentUser?.userId && profile.profile?.userId && currentUser.userId === profile.profile.userId);

  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.blogs.getPaginatedPostsByAuthor,
    userId ? { author: userId, onlyVideos: true } : "skip",
    { initialNumItems: 7 }
  );

  const isFirstLoad = status === "LoadingFirstPage";
  const canLoadMore = status === "CanLoadMore";

  const lastResultsRef = useRef<Doc<"blogs">[]>([]);
  if (results.length > 0) {
    lastResultsRef.current = results as Doc<"blogs">[];
  }

  const preloadedItems = Array.isArray(preloadedData)
    ? preloadedData
    : preloadedData?.page ?? [];

  const displayResults =
    results.length > 0
      ? (results as Doc<"blogs">[])
      : isFirstLoad && preloadedItems.length > 0
      ? (preloadedItems as Doc<"blogs">[])
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
    <div className="flex flex-col flex-1 h-full min-h-0 w-full p-2">
      <div className="w-full mx-auto flex flex-col flex-1 h-full min-h-0">
        
        {isFirstLoad && displayResults.length === 0 ? (
          <ul className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <li key={i}>
                <CompactSeriesCardSkeleton />
              </li>
            ))}
          </ul>
        ) : displayResults.length === 0 ? (
          <div className="flex flex-1 h-full w-full items-center">
            <EmptyState
              icon={List}
              size="sm"
              title="No series found"
              description="This user hasn't created any article series yet."
              action={
                isOwnProfile ? (
                  <Button
                    onClick={() => setIsCreateOpen(true)}
                    variant="outline"
                    className="h-11 md:h-8 rounded-full border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs text-zinc-700 dark:text-zinc-200 shadow-none transition-all flex items-center gap-2 px-3.5 cursor-pointer"
                  >
                    Create New
                  </Button>
                ) : undefined
              }
            />
          </div>
        ) : (
          <>
            <ul className="flex flex-col gap-2">
              {displayResults.map((video, index) => (
                <li key={video._id}>
                  <VideoCard
                    video={video}
                    index={index}
                  />
                </li>
              ))}
            </ul>
            
            <div ref={loadMoreRef} className="w-full">
              {isLoading && status === "LoadingMore" && (
                <div className="py-4 flex justify-center">
                  <CompactSeriesCardSkeleton />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <CreateSeriesDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  );
}