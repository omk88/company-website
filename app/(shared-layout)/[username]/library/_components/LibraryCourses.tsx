"use client";

import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { useEffect, useRef } from "react";
import SeriesCard from "../../_components/SeriesCard";
import { EmptyState } from "@/components/web/EmptyState";
import { CompactSeriesCardSkeleton } from "@/components/web/LoadingSkeletons/CompactSeriesCardSkeleton";
import { FunctionReturnType } from "convex/server";
import { Library } from "lucide-react";
import { useCurrentUser } from "@/app/ConvexClientProvider";

type ProfileData = FunctionReturnType<typeof api.profiles.getProfileByUsername>;

interface LibraryCoursesProps {
  profile: ProfileData;
  preloadedData?: any;
}

export function LibraryCourses({ profile, preloadedData }: LibraryCoursesProps) {
  const userId = profile?.profile?.userId;

  const currentUser = useCurrentUser();
  const isAuthLoading = currentUser === undefined;
  const isOwnProfile = Boolean(
    currentUser?.userId &&
      profile?.profile?.userId &&
      currentUser.userId === profile.profile.userId
  );

  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.courses.getPaginatedPurchasesByAuthor,
    userId ? { userId } : "skip",
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
        
        {isInitialLoading ? (
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
              icon={Library}
              size="sm"
              title="No insights found"
              description="This user hasn't posted any insights yet."
            />
          </div>
        ) : (
          <>
            <ul className="flex flex-col gap-2">
              {displayResults.map((series: any) => (
                <li key={series._id}>
                  <SeriesCard
                    series={series}
                    isCompact={true}
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
    </div>
  );
}