"use client";

import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { useEffect, useRef } from "react";
import { ProfileCard } from "./ProfileCard";
import { FunctionReturnType } from "convex/server";
import { EmptyState } from "./EmptyState";
import { ProfileCardSkeleton } from "./ProfileFollows";

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

  if (isFirstLoad && displayResults.length === 0) {
    return <LoadingSkeleton />;
  }

  if (displayResults.length === 0) {
    return (
      <div className="flex flex-col flex-1 h-full min-h-0">
        <EmptyState size="sm" title="No users found" description="This user doesn't have any followers yet." />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto flex-1 p-2">
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
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto px-6 pt-4">
      <ul className="flex flex-col gap-2 w-full">
        {[1, 2, 3, 4, 5].map((i) => (
          <li key={i}>
            <ProfileCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}