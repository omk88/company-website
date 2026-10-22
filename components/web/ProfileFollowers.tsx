"use client";

import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { useEffect, useRef } from "react";
import { ProfileCard } from "./ProfileCard";
import { FunctionReturnType } from "convex/server";
import { EmptyState } from "./EmptyState";
import { ProfileCardSkeleton } from "./ProfileFollows";
import { UsersRound } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type ProfileData = FunctionReturnType<typeof api.profiles.getProfileByUsername>;
type CurrentUserData = FunctionReturnType<typeof api.auth.getCurrentUser>;

type FollowerItem = FunctionReturnType<typeof api.profiles.getPaginatedFollowersByProfile>["page"][number];

interface ProfileFollowersProps {
  profile: ProfileData;
  currentUser?: CurrentUserData;
  preloadedData?: any;
}

export function ProfileFollowers({ profile, currentUser, preloadedData }: ProfileFollowersProps) {
  const currentUserId = currentUser?.profile?.userId;
  const targetUserId = profile?.profile?.userId;

  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.profiles.getPaginatedFollowersByProfile,
    targetUserId ? { userId: targetUserId } : "skip",
    { initialNumItems: 10 }
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
          loadMore(10);
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
              <Skeleton className="h-6 w-20 rounded-lg" />
            ) : (
              <h3 className="text-sm font-medium bg-muted/80 px-2 p-0.5 rounded-lg text-zinc-500">
                Followers
              </h3>
            )}
          </div>
        )}

        {isInitialLoading ? (
          <ul className="flex flex-col gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <li key={i}>
                <ProfileCardSkeleton />
              </li>
            ))}
          </ul>
        ) : displayResults.length === 0 ? (
          <div className="flex flex-1 h-full w-full items-center">
            <EmptyState
              icon={UsersRound}
              size="sm"
              title="No users found"
              description="This user doesn't have any followers yet."
            />
          </div>
        ) : (
          <>
            <ul className="flex flex-col gap-2">
              {displayResults.map((rawItem: any) => {
                const item = rawItem as unknown as FollowerItem;
                if (!item?.profile) return null;

                const { profile: targetProfile, profilePicture, defaultProfilePicture, isFollowing, isBell, followedAt } = item;
                
                const isSelf = Boolean(currentUserId && targetProfile.userId === currentUserId);

                return (
                  <li key={targetProfile._id}>
                    <ProfileCard
                      userId={targetProfile.userId}
                      displayName={targetProfile.displayName ?? targetProfile.username}
                      username={targetProfile.username}
                      profilePicture={profilePicture}
                      defaultProfilePicture={defaultProfilePicture}
                      isFollowing={isFollowing}
                      isBell={isBell}
                      isSelf={isSelf}
                      followedAt={followedAt}
                    />
                  </li>
                );
              })}
            </ul>

            <div ref={loadMoreRef} className="h-0 w-full clear-both" />

            {isLoading && status === "LoadingMore" && (
              <div className="pt-2">
                <ProfileCardSkeleton />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}