"use client";

import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { ProfileCard } from "./ProfileCard";
import { Id } from "@/convex/_generated/dataModel";
import { useFollowsStore } from "@/stores/useFollowsStore";
import { cn } from "@/lib/utils";
import { UserRoundCheck, UsersRound } from "lucide-react";
import { FunctionReturnType } from "convex/server";

type ProfileData = FunctionReturnType<typeof api.profiles.getProfileByUsername>;
type CurrentUserData = FunctionReturnType<typeof api.auth.getCurrentUser>;

type FollowerItem = FunctionReturnType<typeof api.profiles.getPaginatedFollowersByProfile>["page"][number];
type FollowingItem = FunctionReturnType<typeof api.profiles.getPaginatedFollowingByProfile>["page"][number];

interface ProfileFollowsProps {
  profile: ProfileData;
  currentUser?: CurrentUserData;
}

export function ProfileFollows({ profile, currentUser }: ProfileFollowsProps) {
  const selectedFollows = useFollowsStore((state) => state.selectedFollows);
  const setSelectedFollows = useFollowsStore((state) => state.setSelectedFollows);

  const anim = "relative no-underline hover:no-underline after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100";
  const currentProfileId = currentUser?.profile?._id;

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 w-full">
      <div className="flex items-center justify-start gap-4 w-full border-b border-border mb-4 shrink-0">
        <button
          type="button"
          onClick={() => setSelectedFollows("followers")}
          className={cn(
            "flex items-center gap-1.5 pb-2 pt-1.5 px-1 font-sans text-sm font-medium transition-colors cursor-pointer text-foreground hover:opacity-70",
            anim,
            selectedFollows === "followers" && "after:scale-x-100 after:origin-bottom-left"
          )}
        >
          <UsersRound className="w-4 h-4 stroke-[2.3] shrink-0" />
          <span>{profile?.profile?.followerCount ?? 0} Followers</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedFollows("following")}
          className={cn(
            "flex items-center gap-1.5 pb-2 pt-1.5 px-1 font-sans text-sm font-medium transition-colors cursor-pointer text-foreground hover:opacity-70",
            anim,
            selectedFollows === "following" && "after:scale-x-100 after:origin-bottom-left"
          )}
        >
          <UserRoundCheck className="w-4 h-4 stroke-[2.3] shrink-0" />
          <span>{profile?.profile?.followingCount ?? 0} Following</span>
        </button>
      </div>

      {selectedFollows === "followers" ? (
        <FollowersList profileId={profile?.profile?._id} currentProfileId={currentProfileId} />
      ) : (
        <FollowingList profileId={profile?.profile?._id} currentProfileId={currentProfileId} />
      )}
    </div>
  );
}

function FollowersList({
  profileId,
  currentProfileId,
}: {
  profileId: string | undefined;
  currentProfileId?: string;
}) {
  const { results, status } = usePaginatedQuery(
    api.profiles.getPaginatedFollowersByProfile,
    profileId ? { profileId: profileId as Id<"profiles"> } : "skip",
    { initialNumItems: 10 }
  );

  const isFirstLoad = !profileId || status === "LoadingFirstPage";

  if (isFirstLoad) {
    return <LoadingSkeleton />;
  }

  if (results.length === 0) {
    return <p className="text-muted-foreground text-sm py-4">No followers found.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {results.map((rawItem) => {
        const item = rawItem as unknown as FollowerItem;
        if (!item?.profile) return null;

        const { profile, profilePicture, defaultProfilePicture, isFollowing, isBell } = item;
        const isSelf = Boolean(currentProfileId && profile._id === currentProfileId);

        return (
          <li key={profile._id}>
            <ProfileCard
              userId={profile._id}
              displayName={profile.displayName ?? profile.username}
              username={profile.username}
              profilePicture={profilePicture}
              defaultProfilePicture={defaultProfilePicture}
              isFollowing={isFollowing}
              isBell={isBell}
              isSelf={isSelf}
            />
          </li>
        );
      })}
    </ul>
  );
}

function FollowingList({
  profileId,
  currentProfileId,
}: {
  profileId: string | undefined;
  currentProfileId?: string;
}) {
  const { results, status } = usePaginatedQuery(
    api.profiles.getPaginatedFollowingByProfile,
    profileId ? { profileId: profileId as Id<"profiles"> } : "skip",
    { initialNumItems: 10 }
  );

  const isFirstLoad = !profileId || status === "LoadingFirstPage";

  if (isFirstLoad) {
    return <LoadingSkeleton />;
  }

  if (results.length === 0) {
    return <p className="text-muted-foreground text-sm py-4">Not following anyone yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {results.map((rawItem) => {
        const item = rawItem as unknown as FollowingItem;
        if (!item?.profile) return null;

        const { profile, profilePicture, defaultProfilePicture, isFollowing, isBell } = item;
        const isSelf = Boolean(currentProfileId && profile._id === currentProfileId);

        return (
          <li key={profile._id}>
            <ProfileCard
              userId={profile._id}
              displayName={profile.displayName ?? profile.username}
              username={profile.username}
              profilePicture={profilePicture}
              defaultProfilePicture={defaultProfilePicture}
              isFollowing={isFollowing}
              isBell={isBell}
              isSelf={isSelf}
            />
          </li>
        );
      })}
    </ul>
  );
}

export function ProfileCardSkeleton() {
  return (
    <div className="flex flex-row items-center gap-2 px-4 py-2 bg-zinc-50/80 dark:bg-zinc-900/80 rounded-xl animate-pulse">
      <div className="h-12 w-12 rounded-full bg-muted shrink-0" />

      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        <div className="h-3.5 w-28 bg-muted rounded" />
        <div className="h-2.5 w-16 bg-muted/60 rounded" />
      </div>

      <div className="h-7 w-16 bg-muted rounded-md shrink-0 ml-auto" />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <ul className="flex flex-col gap-2 w-full">
      {[1, 2, 3, 4, 5].map((i) => (
        <li key={i}>
          <ProfileCardSkeleton />
        </li>
      ))}
    </ul>
  );
}