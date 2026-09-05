"use client";

import { formatSmartDate } from "./ProfileHoverCard";

export interface CommentNotificationCardProps {
  _id: string;
  blogId: string;
  title: string;
  body: string;
  createdAt: number;
  isUnread?: boolean;
}

export default function CommentNotificationCard({
  _id,
  blogId,
  title,
  body,
  createdAt,
  isUnread = true,
}: CommentNotificationCardProps) {
  return (
    <div className="relative w-full flex flex-row items-center gap-3 p-2 rounded-lg bg-zinc-50/80 hover:bg-accent transition-colors cursor-pointer group">
      {isUnread && (
        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 z-10" />
      )}
      <div className="flex-1 min-w-0 flex flex-row items-center justify-between gap-3 pr-4">
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
          <h3 className="text-sm font-medium leading-snug text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1 transition-colors">
            {body}
          </h3>

          <time className="text-xs text-zinc-400">
            {formatSmartDate(createdAt, false)}
          </time>
        </div>
      </div>
    </div>
  );
}