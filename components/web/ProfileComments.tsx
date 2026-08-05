"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, useConvex, usePreloadedQuery } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { ProfileCommentCard } from "./ProfileCommentCard";
import { useLocalSearch } from "./SearchContext";
import { SelectableCardWrapper } from "./SelectableCardWrapper";
import { Id } from "@/convex/_generated/dataModel";

interface ProfileCommentsProps {
    username: string;
    preloadedProfile: Preloaded<typeof api.profiles.getProfileByUsername>;
    preloadedInitialComments: Preloaded<typeof api.comments.getPaginatedCommentsByUsername>;
    preloadedCurrentUser: Preloaded<typeof api.auth.getCurrentUser>;
    selectedIds: Id<"comments">[];
    setSelectedIds: React.Dispatch<React.SetStateAction<Id<"comments">[]>>;
    onLoadedIdsChange: (ids: Id<"comments">[]) => void;
}

export function ProfileComments({ username, preloadedInitialComments, selectedIds, setSelectedIds, preloadedProfile, preloadedCurrentUser, onLoadedIdsChange }: ProfileCommentsProps) {
    const convex = useConvex();

    const initialData = usePreloadedQuery(preloadedInitialComments);
    const currentUser = usePreloadedQuery(preloadedCurrentUser);
    const profileData = usePreloadedQuery(preloadedProfile);
    const profile = profileData.profile;

    const searchContext = useLocalSearch();
    const searchTerm = searchContext?.searchTerm ?? "";
    const sortOrder = searchContext?.sortOrder ?? "new";

    const [comments, setComments] = useState(initialData.page);
    const [cursor, setCursor] = useState<string | null>(initialData.continueCursor);
    const [isDone, setIsDone] = useState(initialData.isDone);
    const [isLoading, setIsLoading] = useState(false);

    const isOwnProfile = currentUser?.userId && profile?.userId && currentUser.userId === profile.userId;

    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!searchTerm.trim() && sortOrder === "new") {
            setComments(initialData.page);
            setCursor(initialData.continueCursor);
            setIsDone(initialData.isDone);
            return;
        }

        let isMounted = true;
        setIsLoading(true);

        const fetchFilteredBlogs = async () => {
            try {
                const result = await convex.query(api.comments.getPaginatedCommentsByUsername, {
                    username,
                    searchTerm: searchTerm.trim(),
                    sortOrder,
                    paginationOpts: {
                        numItems: 6,
                        cursor: null,
                        id: 0,
                    },
                });

                if (isMounted) {
                    setComments(result.page);
                    setCursor(result.continueCursor);
                    setIsDone(result.isDone);
                }
            } catch (error) {
                console.error("Error searching blogs:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchFilteredBlogs();

        return () => {
            isMounted = false;
        };
    }, [searchTerm, sortOrder, username, convex, initialData]);

    const loadMore = async () => {
        if (isDone || isLoading || !cursor) return;
        setIsLoading(true);

        try {
            const result = await convex.query(api.comments.getPaginatedCommentsByUsername, {
                username,
                searchTerm: searchTerm.trim() || undefined,
                sortOrder,
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
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (isDone || isLoading) return;

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
    }, [cursor, isDone, isLoading, searchTerm, sortOrder]);

    useEffect(() => {
        onLoadedIdsChange(comments.map((comment) => comment._id));
    }, [comments, onLoadedIdsChange]);

    const handleSelectChange = (id: Id<"comments">, checked: boolean) => {
        setSelectedIds((prev) =>
            checked ? [...prev, id] : prev.filter((item) => item !== id)
        );
    };

    return (
        <div className="w-full space-y-4">
            {comments.length === 0 ? (
                <p className="text-muted-foreground">{username} has not posted any comments yet.</p>
                ) : (
                    <>
                        <ul className="w-full flex flex-col gap-4">
                            {comments.map((comment) => (
                                <li key={comment._id} >
                                    <SelectableCardWrapper
                                        id={comment._id}
                                        isSelected={selectedIds.includes(comment._id)}
                                        onSelectChange={handleSelectChange}
                                        isOwnProfile={isOwnProfile}
                                    >
                                        <ProfileCommentCard id={comment._id} displayName={comment.displayName} username={comment.username} blogTitle={comment.blogTitle} body={comment.body} likes={comment.likes} date={comment._creationTime}  />
                                    </SelectableCardWrapper>
                                </li>
                            ))}
                        </ul>

                        {!isDone && (
                            <div ref={loadMoreRef} className="py-6 text-center text-sm text-muted-foreground">
                                {isLoading ? "Loading more blogs..." : "Loading..."}
                            </div>
                        )}
                    </>
                )}
        </div>
    );
}