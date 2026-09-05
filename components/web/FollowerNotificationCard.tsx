"use client";

import { FollowButton } from "./FollowButton";
import { formatSmartDate } from "./ProfileHoverCard";

export interface FollowerNotificationCardProps {
  _id: string;
  username: string;
  displayName: string;
  profilePicUrl: string;
  defaultProfilePicUrl: string;
  createdAt: number;
  isUnread?: boolean;
  initialIsFollowing?: boolean;
  initialIsBell?: boolean;
  isSelf?: boolean;
}

export default function FollowerNotificationCard({
  _id,
  username,
  displayName,
  profilePicUrl,
  defaultProfilePicUrl,
  createdAt,
  isUnread = true,
  initialIsFollowing,
  initialIsBell,
  isSelf,
}: FollowerNotificationCardProps) {

  return (
    <div className="relative w-full flex flex-row items-center gap-3 p-2 rounded-lg bg-zinc-50/80 hover:bg-accent has-[button:hover]:bg-zinc-50/80 transition-colors cursor-pointer group overflow-hidden">
      {isUnread && (
        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500" />
      )}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
        <div className="flex flex-row items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 rounded-full overflow-hidden border border-border bg-muted shrink-0 flex items-center justify-center">
            <img
              src={profilePicUrl || defaultProfilePicUrl}
              alt={username}
              loading="eager"
              decoding="sync"
              suppressHydrationWarning
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-medium leading-snug text-zinc-800 group-hover:text-blue-600 dark:group-hover:text-blue-400 dark:text-zinc-200 truncate">
              {displayName}
            </span>
            <span className="text-xs font-medium leading-snug text-muted-foreground truncate transition-colors">
              @{username}
            </span>
          </div>

          <div className="shrink-0 ml-1">
            <FollowButton userId={_id} username={username} displayName={displayName} variant="xs" initialIsFollowing={initialIsFollowing} initialIsBell={initialIsBell} isSelf={isSelf} />
          </div>
        </div>

        <time className="text-xs text-zinc-400">
          {formatSmartDate(createdAt, false)}
        </time>
      </div>
    </div>
  );
}