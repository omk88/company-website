"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { ProfileHoverCard } from "../ProfileHoverCard";
import Image from "next/image";

interface BlogNameProps {
    avatarSrc: string;
    username: string;
    displayName: string | undefined;
    date: number;
    readTime: number;
}

export function BlogName({ avatarSrc, username, displayName, date, readTime }: BlogNameProps) {

    const isDesktop = useMediaQuery("(min-width: 768px)");
    const authorName = displayName || username;

    if (isDesktop) {
        return (
            <div className="py-4 flex flex-row justify-between gap-1.5 items-center w-full">
                <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0">
                    <Image
                        src={avatarSrc}
                        alt={`${authorName}'s avatar`}
                        fill
                        sizes="20px"
                        className="object-cover"
                    />
                </div>
                <ProfileHoverCard authorUsername={username} displayName={displayName}>
                    <span className="cursor-pointer">
                        {authorName}
                    </span>
                </ProfileHoverCard>

                <span>&middot;</span>

                <time dateTime={new Date(date).toISOString()}>
                    {new Date(date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </time>

                <span className="text-sm text-zinc-500 font-medium ml-auto">
                    {readTime} min read
                </span>
            </div>
        )
    } else {
        return (
            <div>
                <div className="py-2 flex flex-row gap-1.5 items-center">
                    <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0">
                        <Image
                            src={avatarSrc}
                            alt={`${authorName}'s avatar`}
                            fill
                            sizes="20px"
                            className="object-cover"
                        />
                    </div>

                    <span className="text-lg">
                        {displayName || username}
                    </span>

                    <span>&middot;</span>

                    <time dateTime={new Date(date).toISOString()}>
                        {new Date(date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </time>
                </div>
                <span className="text-lg">
                    {readTime} min read
                </span>
            </div>
        )
    }
}