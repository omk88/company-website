"use client";

import { EMOJI_REACTIONS } from "@/app/constants/reactions";
import { Badge } from "../ui/badge";
import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

interface BlogEmojiReactionsProps {
    initialBlog: Doc<"blogs">,
}

export function BlogEmojiReactions({ initialBlog }: BlogEmojiReactionsProps) {

    const blog = useQuery(api.blogs.getBlogById, { blogId: initialBlog._id }) ?? initialBlog;

    const hasReactions = EMOJI_REACTIONS.some(
        ({ field }) => ((blog[field] ?? 0) as number) > 0
    );

    return (
        <div className="flex flex-wrap items-center gap-1.5 min-h-[34px]">
            {hasReactions ? (
                EMOJI_REACTIONS.map(({ type, field, emoji, label }) => {
                    const count = (blog[field] ?? 0) as number;

                    if (count === 0) return null;

                    return (
                        <Badge
                            key={type}
                            variant="secondary"
                            className="flex items-center gap-1.5 px-2.5 py-1 text-md font-medium"
                            title={label}
                        >
                            <span>{emoji}</span>
                            <span className="text-muted-foreground">{count}</span>
                        </Badge>
                    );
                })
            ) : null}
        </div>
    )
}