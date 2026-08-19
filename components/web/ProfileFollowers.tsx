"use client";

import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { useRef } from "react";
import { ProfileCard } from "./ProfileCard";
import { Id } from "@/convex/_generated/dataModel";

interface ProfileFollowersProps {
  profileId: string | undefined;
  profilePicture: string | null;
  defaultProfilePicture: string | null;
}

export function ProfileFollowers({ profileId, profilePicture, defaultProfilePicture }: ProfileFollowersProps) {
  const { results, status } = usePaginatedQuery(
    api.profiles.getPaginatedFollowersByProfile,
    profileId ? { profileId: profileId as Id<"profiles">  } : "skip",
    { initialNumItems: 10 }
  );

  const isFirstLoad = !profileId || status === "LoadingFirstPage";

  const lastResultsRef = useRef<any[]>([]);
  if (results.length > 0) {
    lastResultsRef.current = results;
  }

  const displayResults = results.length > 0 ? results : lastResultsRef.current;
  const loadMoreRef = useRef<HTMLDivElement>(null);

  if (isFirstLoad && displayResults.length === 0) {
    return (
      <div className="flex flex-col flex-1 h-full min-h-0 w-full">
        <ul className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <li key={i}>
              <></>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 w-full">
      {displayResults.length === 0 ? (
        <div className="flex flex-col flex-1 h-full min-h-0">
          <></>
        </div>
      ) : (
        <>
          <ul className="flex flex-col gap-2">
            {displayResults.map(({ profile, profilePicture, defaultProfilePicture }: any) => (
              <li key={profile._id}>
                <ProfileCard
                  userId={profile.userId}
                  displayName={profile.displayName}
                  username={profile.username}
                  profilePicture={profilePicture}
                  defaultProfilePicture={defaultProfilePicture}  
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