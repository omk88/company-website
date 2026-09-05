"use client";

import Image from "next/image";
import Link from "next/link";
import { formatSmartDate } from "./ProfileHoverCard";

export interface BlogNotificationCardProps {
  _id: string;
  title: string;
  imageUrl?: string;
  createdAt: number;
  isUnread?: boolean;
}

export default function BlogNotificationCard({
  _id,
  title,
  imageUrl,
  createdAt,
  isUnread = true,
}: BlogNotificationCardProps) {
  return (
    <Link
      href={`/insights/${_id}`}
      className="relative w-full flex flex-row items-center justify-between gap-3 p-2.5 rounded-lg bg-zinc-50/80 dark:bg-zinc-900/50 hover:bg-accent transition-colors cursor-pointer group"
    >
      {isUnread && (
        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 z-10" />
      )}

      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
        <h3 className="text-sm font-medium leading-snug text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1 transition-colors">
          {title}
        </h3>
        <time className="text-xs text-zinc-400">
          {formatSmartDate(createdAt, false)}
        </time>
      </div>

      <div className="shrink-0">
        <div className="relative w-10 h-10 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={imageUrl || "/default-cover.png"}
            alt={title}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
      </div>
    </Link>
  );
}