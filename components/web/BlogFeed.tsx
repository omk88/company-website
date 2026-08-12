"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, usePaginatedQuery, usePreloadedQuery } from "convex/react";
import { useEffect, useRef } from "react";
import { BlogCard } from "./BlogCard";

interface BlogFeedProps {
    postType?: "community" | "team";
    isPopularOnly?: boolean;
    searchTerm: string;
    activeTags: string[];
    sortOrder: string;
    isActive: boolean;
    preloadedFeed?: Preloaded<typeof api.blogs.getPaginatedPostsByType>;
}

export function BlogFeed(props: BlogFeedProps) {
    if (props.preloadedFeed) {
        return <PreloadedBlogFeed {...props} preloadedFeed={props.preloadedFeed} />;
    }

    return <StandardBlogFeed {...props} />;
}

function PreloadedBlogFeed({
    preloadedFeed,
    ...props
}: BlogFeedProps & { preloadedFeed: Preloaded<typeof api.blogs.getPaginatedPostsByType> }) {
    const preloadedData = usePreloadedQuery(preloadedFeed);

    return <StandardBlogFeed {...props} preloadedData={preloadedData} />;
}

function StandardBlogFeed({
    postType,
    isPopularOnly,
    searchTerm,
    activeTags,
    sortOrder,
    isActive,
    preloadedData,
}: BlogFeedProps & { preloadedData?: any }) {
    const trimmedSearch = searchTerm.trim();
    
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

    const isFirstLoad = status === "LoadingFirstPage";
    const hasActiveFilters = 
        trimmedSearch.length > 0 ||
        activeTags.length > 0 || 
        sortOrder !== "new";
    const canUsePreloadedData = preloadedData && !hasActiveFilters;

    const lastResultsRef = useRef<any[]>([]);
    if (results.length > 0) {
        lastResultsRef.current = results;
    }

    const displayResults =
        results.length > 0
        ? results
        : isFirstLoad && canUsePreloadedData
        ? preloadedData.page
        : lastResultsRef.current;

    const loadMoreRef = useRef<HTMLDivElement>(null);
    const isDone = status === "Exhausted";
    const isLoadingMore = status === "LoadingMore";

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
    }, [isActive, isDone, isLoadingMore, status, loadMore]);

    return (
        <>
            {displayResults.length === 0 ? (
                <p className="text-muted-foreground">No insights found.</p>
            ) : (
                <ul className="flex flex-col gap-2">
                    {displayResults.map((blog: any) => (
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
        </>
    );
}