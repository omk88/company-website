"use client";

import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { useEffect, useRef, useState } from "react";
import SeriesCard from "./SeriesCard";
import { Doc } from "@/convex/_generated/dataModel";
import { FunctionReturnType } from "convex/server";
import { CompactSeriesCardSkeleton } from "@/components/web/LoadingSkeletons/CompactSeriesCardSkeleton";
import { EmptyState } from "@/components/web/EmptyState";
import { List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateSeriesDialog } from "./CreateSeriesDialog";
import { useCurrentUser } from "@/app/ConvexClientProvider";

type ProfileData = FunctionReturnType<typeof api.profiles.getProfileByUsername>;

interface ProfileArticleSeriesProps {
  profile: ProfileData;
  preloadedData?: any;
}

export function ProfileArticleSeries({ profile, preloadedData }: ProfileArticleSeriesProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const userId = profile?.profile?.userId;

  const currentUser = useCurrentUser();
  const isOwnProfile = Boolean(currentUser?.userId && profile.profile?.userId && currentUser.userId === profile.profile.userId);

  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.series.getPaginatedSeriesByAuthor,
    userId ? { author: userId } : "skip",
    { initialNumItems: 7 }
  );

  const isFirstLoad = status === "LoadingFirstPage";
  const canLoadMore = status === "CanLoadMore";

  const lastResultsRef = useRef<Doc<"series">[]>([]);
  if (results.length > 0) {
    lastResultsRef.current = results as Doc<"series">[];
  }

  const preloadedItems = Array.isArray(preloadedData)
    ? preloadedData
    : preloadedData?.page ?? [];

  const displayResults =
    results.length > 0
      ? (results as Doc<"series">[])
      : isFirstLoad && preloadedItems.length > 0
      ? (preloadedItems as Doc<"series">[])
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
        
        {displayResults.length > 0 && (
          <div className="flex justify-between items-center mb-2 px-2">
            <h3 className="text-sm font-medium bg-muted/80 px-2 p-0.5 rounded-lg text-zinc-500">Article Series</h3>
            {isOwnProfile && 
              <Button
                onClick={() => setIsCreateOpen(true)}
                variant="outline"
                size="sm"
                className="h-11 md:h-6 rounded-full border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs text-zinc-700 dark:text-zinc-200 shadow-none transition-all flex items-center gap-2 px-2 cursor-pointer"
              >
                <Plus className="size-6 md:size-3.5 shrink-0 stroke-[2.5]" /> New Series
              </Button>
            }
          </div>
        )}

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
                <Button
                  onClick={() => setIsCreateOpen(true)}
                  variant="outline"
                  className="h-11 md:h-8 rounded-full border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs text-zinc-700 dark:text-zinc-200 shadow-none transition-all flex items-center gap-2 px-3.5 cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Create New
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <ul className="flex flex-col gap-2">
              {displayResults.map((series, index) => (
                <li key={series._id}>
                  <SeriesCard
                    series={series}
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