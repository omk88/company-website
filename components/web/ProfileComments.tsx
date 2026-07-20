"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, useConvex, usePreloadedQuery } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { ProfileCommentCard } from "./ProfileCommentCard";

interface ProfileCommentsProps {
    username: string;
    preloadedInitialComments: Preloaded<typeof api.comments.getPaginatedCommentsByUsername>;
}

export function ProfileComments({ username, preloadedInitialComments }: ProfileCommentsProps) {
    const convex = useConvex();
    const initialData = usePreloadedQuery(preloadedInitialComments);

    const [comments, setComments] = useState(initialData.page);
    const [cursor, setCursor] = useState<string | null>(initialData.continueCursor);
    const [isDone, setIsDone] = useState(initialData.isDone);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const loadMoreRef = useRef<HTMLDivElement>(null);

    const loadMore = async () => {
        if (isDone || isLoadingMore || !cursor) return;
        setIsLoadingMore(true);

        try {
            const result = await convex.query(api.comments.getPaginatedCommentsByUsername, {
                username,
                paginationOpts: {
                    numItems: 6,
                    cursor: cursor,
                    id: 0,
                }
            });

            setComments((prev) => [...prev, ...result.page]);
            setCursor(result.continueCursor);
            setIsDone(result.isDone);
        } catch (error) {
            console.error("Error loading more blogs:", error);
        } finally {
            setIsLoadingMore(false);
        }
    }

    useEffect(() => {
        if (isDone) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore()
                }
            },
            { rootMargin: "200px" }
        );

        const currentTarget = loadMoreRef.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) observer.unobserve(currentTarget);
        };
    }, [cursor, isDone, isLoadingMore]);

    return (
        <div className="w-full space-y-4">
            {comments.length === 0 ? (
                <p className="text-muted-foreground">No blogs posted yet.</p>
                ) : (
                    <>
                        <ul className="w-full flex flex-col gap-4">
                            {comments.map((comment) => (
                                <li key={comment._id} >
                                    <ProfileCommentCard id={comment._id} authorName={comment.authorName} blogTitle={comment.blogTitle} body={comment.body} likes={comment.likes} date={comment._creationTime} />
                                </li>
                            ))}
                        </ul>

                        {!isDone && (
                            <div ref={loadMoreRef} className="py-6 text-center text-sm text-muted-foreground">
                                {isLoadingMore ? "Loading more blogs..." : "Loading..."}
                            </div>
                        )}
                    </>
                )}
        </div>
    );
}