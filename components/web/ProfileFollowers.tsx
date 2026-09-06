"use client";

import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
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
}

export function ProfileFollowers({ profile, currentUser }: ProfileFollowersProps) {
  const currentUserId = currentUser?.profile?.userId;
  const targetUserId = profile?.profile?.userId;

  const { results, status } = usePaginatedQuery(
    api.profiles.getPaginatedFollowersByProfile,
    targetUserId ? { userId: targetUserId } : "skip",
    { initialNumItems: 10 }
  );

  const isFirstLoad = !targetUserId || status === "LoadingFirstPage";

  if (isFirstLoad) {
    return <LoadingSkeleton />;
  }

  if (results.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto px-6 pt-4">
        <EmptyState size="sm" title="No users found" description="This user doesn't have any followers yet." />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto flex-1 p-2">
      <ul className="flex flex-col gap-2">
        {results.map((rawItem) => {
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