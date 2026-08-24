"use client";

import { BlogFeed } from "./BlogFeed";
import { useSearchStore, FeedType } from "@/stores/useSearchStore";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const FEEDS: { id: FeedType; dbPostType?: "community" | "team"; isPopularOnly?: boolean }[] = [
    { id: "all" },
    { id: "popular", isPopularOnly: true },
    { id: "team", dbPostType: "team" },
    { id: "community", dbPostType: "community" },
];

export function BlogFeedWrapper({ preloadedData }: {preloadedData: Preloaded<typeof api.blogs.getPaginatedPostsByType>}) {
    const feedType = useSearchStore((state) => state.feedType);
    const searchTerm = useSearchStore((state) => state.searchTerm);
    const activeTags = useSearchStore((state) => state.activeTags);
    const sortOrder = useSearchStore((state) => state.sortOrder);

    const initialData = usePreloadedQuery(preloadedData);

    return (
        <>
            {FEEDS.map((feed) => {
                const isActive = feedType === feed.id;

                return (
                    <div
                        key={feed.id}
                        className={isActive ? "flex flex-col flex-1 h-full min-h-0" : "hidden"}
                    >
                        <BlogFeed
                            postType={feed.dbPostType}
                            isPopularOnly={feed.isPopularOnly}
                            searchTerm={searchTerm}
                            activeTags={activeTags}
                            sortOrder={sortOrder}
                            isActive={isActive}
                            isInitialFeed={feed.id === "all"}
                            preloadedData={initialData}
                        />
                    </div>
                );
            })}
        </>
    )
}