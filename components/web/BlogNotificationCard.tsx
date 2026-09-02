"use client";

import Image from "next/image";
import Link from "next/link";
import { formatSmartDate } from "./ProfileHoverCard";

export interface BlogNotificationCardProps {
  _id: string;
  title: string;
  imageUrl: string;
  createdAt: number;
  author?: string;
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
      href={`/blog/${_id}`}
      className="w-full flex flex-col p-2 rounded-lg bg-zinc-50/80 dark:bg-zinc-900/50 hover:bg-accent transition-colors cursor-pointer group"
    >
      <div className="flex-1 min-w-0 flex flex-row justify-between gap-3">
        <div className="flex-1 min-w-0 flex flex-col">
          <h3 className="text-[13px] font-medium leading-snug text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 transition-colors">
            {title}
          </h3>
        </div>

        <div className="relative shrink-0">
          <div className="relative w-11 h-11 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={imageUrl || "/default-cover.png"}
              alt={title}
              fill
              sizes="44px"
              className="object-cover"
            />
          </div>

          {isUnread && (
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background" />
          )}
        </div>
      </div>

      <div className="mt-1">
        <span className="text-[11px] text-muted-foreground">
          <time className="text-xs text-zinc-400">
            {formatSmartDate(createdAt, false)}
          </time>
        </span>
      </div>
    </Link>
  );
}