"use client";

import { FollowButton } from "./FollowButton";
import { ProfileHoverCard } from "./ProfileHoverCard";
import Link from "next/link";

interface ProfileCardProps {
  userId: string;
  displayName: string;
  username: string;
  profilePicture: string | null;
  defaultProfilePicture: string | null;
  isFollowing?: boolean;
  isBell?: boolean;
  isSelf?: boolean;
}

export function ProfileCard({
  userId,
  displayName,
  username,
  profilePicture,
  defaultProfilePicture,
  isFollowing = false,
  isBell = false,
  isSelf = false,
}: ProfileCardProps) {
  return (
    <Link 
      href={`/${username}`}
      className="block text-inherit no-underline"
    >
      <div 
        className="flex flex-row items-center gap-2 px-4 py-2 bg-zinc-50/80 dark:bg-zinc-900/80 rounded-xl cursor-pointer transition-colors hover:bg-zinc-100/90 dark:hover:bg-zinc-800/90 [&:has(.no-card-hover:hover)]:bg-zinc-50/80 dark:[&:has(.no-card-hover:hover)]:bg-zinc-900/80"
      >
        <div className="h-12 w-12 border-2 border-muted rounded-full overflow-hidden bg-muted relative shrink-0">
          <img
            src={profilePicture || defaultProfilePicture || ""}
            alt={displayName || username}
            className="h-full w-full object-cover rounded-full"
            decoding="async" 
          />
        </div>

        <div className="flex flex-col min-w-0">
          <ProfileHoverCard authorUsername={username} displayName={displayName || username}>
            <span className="text-sm font-semibold truncate">
              {displayName || username}
            </span>
          </ProfileHoverCard>
          <span className="text-xs font-extralight text-zinc-600 dark:text-zinc-400 truncate">
            @{username}
          </span>
        </div>

        {!isSelf && (
          <div 
            className="no-card-hover ml-auto shrink-0"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <FollowButton 
              userId={userId} 
              username={username} 
              displayName={displayName} 
              initialIsFollowing={isFollowing}
              initialIsBell={isBell}
              isSelf={isSelf}
              variant="compact" 
            />
          </div>
        )}
      </div>
    </Link>
  );
}