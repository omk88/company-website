"use client";

import Link from "next/link";
import { formatSmartDate } from "./ProfileHoverCard";
import { ThumbsUp } from "lucide-react";

export interface CommentLikesNotificationCardProps {
    _id: string;
    commentBody: string;
    createdAt: number;
    isUnread?: boolean;
}

export default function CommentLikesNotificationCard({
    _id,
    commentBody,
    createdAt,
    isUnread = true,
}: CommentLikesNotificationCardProps) {

    return (
        <Link
            href={`/insights/${_id}`}
            className="relative w-full flex flex-row items-center gap-3 p-2 rounded-lg bg-zinc-50/80 hover:bg-accent transition-colors cursor-pointer group overflow-hidden"
        >
            {isUnread && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 z-10" />
            )}
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                <div className="flex flex-row items-center gap-2.5 min-w-0">
                    <div className="flex flex-row min-w-0 flex-1 items-center ">
                        <span className="text-sm font-medium leading-snug text-zinc-800 group-hover:text-blue-600 dark:group-hover:text-blue-400 dark:text-zinc-200 truncate">
                            {commentBody}
                        </span>
                        <div className="flex items-center shrink-0 ml-auto">
                            <ThumbsUp
                                className={`w-5 h-5 shrink-0 transition-none text-emerald-500 fill-emerald-500`}
                            />
                        </div>
                    </div>
                </div>

                <time className="text-xs text-zinc-400">
                    {formatSmartDate(createdAt, false)}
                </time>
            </div>
        </Link>
    );
}