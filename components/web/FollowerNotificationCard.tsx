"use client";

import { formatSmartDate } from "./ProfileHoverCard";

export interface FollowerNotificationCardProps {
  username: string;
  displayName: string;
  profilePicUrl: string;
  defaultProfilePicUrl: string;
  createdAt: number;
  isUnread?: boolean;
}

export default function CommentNotificationCard({
  username,
  displayName,
  profilePicUrl,
  defaultProfilePicUrl,
  createdAt,
  isUnread = true,
}: FollowerNotificationCardProps) {
  return (
    <div className="relative w-full flex flex-row items-center gap-3 p-2 rounded-lg bg-zinc-50/80 hover:bg-accent transition-colors cursor-pointer group">
      {isUnread && (
        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500" />
      )}
      <div className="flex-1 min-w-0 flex flex-row items-center justify-between gap-3 pr-4">
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
          
          <div className="flex flex-row items-center gap-3">
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
            <div className="flex flex-col">
                <span className="text-sm font-medium leading-snug text-zinc-800 dark:text-zinc-200 line-clamp-1">
                    {displayName}
                </span>
                <span className="text-sm font-medium leading-snug text-muted-foreground line-clamp-1 transition-colors">
                    @{username}
                </span>
            </div>
          </div>

          <time className="text-xs text-zinc-400">
            {formatSmartDate(createdAt, false)}
          </time>
        </div>
      </div>
    </div>
  );
}