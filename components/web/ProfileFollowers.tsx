"use client";

import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { useRef } from "react";
import { ProfileCard } from "./ProfileCard";
import { Id } from "@/convex/_generated/dataModel";
import { useFollowsStore } from "@/stores/useFollowsStore";
import { cn } from "@/lib/utils";
import { profile } from "console";
import { UserCheck, UsersRound } from "lucide-react";

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

  const selectedFollows = useFollowsStore((follows) => follows.selectedFollows);
  const setSelectedFollows = useFollowsStore((follows) => follows.setSelectedFollows);

  const anim = "relative no-underline hover:no-underline after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100";

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
          <div>
            <div className="flex items-center justify-start gap-4 w-full border-b border-border mb-4">
              <button
                type="button"
                onClick={() => setSelectedFollows('followers')}
                className={cn(
                  "flex items-center gap-1.5 pb-2 pt-1.5 px-1 font-sans text-sm font-medium transition-colors cursor-pointer text-foreground hover:opacity-70",
                  anim,
                  selectedFollows === 'followers' && "after:scale-x-100 after:origin-bottom-left"
                )}
              >
                <UsersRound className="w-4 h-4 stroke-[2.3] shrink-0" />
                <span>{0} followers</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFollows('following')}
                className={cn(
                  "flex items-center gap-1.5 pb-2 pt-1.5 px-1 font-sans text-sm font-medium transition-colors cursor-pointer text-foreground hover:opacity-70",
                  anim,
                  selectedFollows === 'following' && "after:scale-x-100 after:origin-bottom-left"
                )}
              >
                <UserCheck className="w-4 h-4 stroke-[2.3] shrink-0" />
                <span>{0} following</span>
              </button>
            </div>
          </div>

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