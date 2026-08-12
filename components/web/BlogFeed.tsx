"use client";

import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { useEffect, useRef } from "react";
import { BlogCard } from "./BlogCard";

interface BlogFeedProps {
    postType?: "community" | "team";
    isPopularOnly?: boolean;
    searchTerm: string;
    activeTags: string[];
    sortOrder: string;
    isActive: boolean;
}

export function BlogFeed({
    postType,
    isPopularOnly,
    searchTerm,
    activeTags,
    sortOrder,
    isActive,
}: BlogFeedProps) {
    const { results, status, loadMore } = usePaginatedQuery(
        api.blogs.getPaginatedPostsByType,
        {
            postType,
            isPopularOnly,
            searchTerm: searchTerm.trim() || undefined,
            activeTags: activeTags.length > 0 ? activeTags : undefined,
            sortOrder,
        },
        { initialNumItems: 6 }
    );

    const loadMoreRef = useRef<HTMLDivElement>(null);
    const isDone = status === "Exhausted";
    const isLoadingMore = status === "LoadingMore";
    const isFirstLoad = status === "LoadingFirstPage";

    useEffect(() => {
        if (!isActive || isDone || isLoadingMore || isFirstLoad) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && status === "CanLoadMore") {
                    loadMore(6);
                }
            },
            { rootMargin: "200px" }
        );

        if (loadMoreRef.current) observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [isActive, isDone, isLoadingMore, isFirstLoad, status, loadMore]);

    if (isFirstLoad) {
        return <div className="p-4 text-center text-muted-foreground">Loading insights...</div>;
    }

    return (
        <>
            {results.length === 0 ? (
                <p className="text-muted-foreground">No insights found.</p>
            ) : (
                <ul className="flex flex-col gap-2">
                    {results.map((blog) => (
                        <li key={blog._id}>
                            <BlogCard
                                id={blog._id}
                                imageUrl={blog.imageUrl}
                                displayName={blog.displayName}
                                username={blog.username}
                                title={blog.title}
                                subtitle={blog.subtitle}
                                totalViews={blog.totalViews}
                                likes={blog.likes}
                                commentCount={blog.commentCount}
                                date={blog._creationTime}
                                readTime={blog.readTime}
                                tags={blog.tags}
                                isInitialBookmarked={blog.isBookmarked}
                            />
                        </li>
                    ))}
                </ul>
            )}

            <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
                {isLoadingMore && <span className="text-xs text-muted-foreground">Loading more...</span>}
            </div>
        </>
    )
}