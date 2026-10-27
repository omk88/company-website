"use client";

import { useState } from "react";
import { BlogFeed } from "./BlogFeed";
import { useSearchStore, FeedType } from "@/stores/useSearchStore";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const FEEDS: { id: FeedType; dbPostType?: "community" | "team"; myFeed?: boolean }[] = [
  { id: "all" },
  { id: "feed", myFeed: true },
  { id: "team", dbPostType: "team" },
  { id: "community", dbPostType: "community" },
];

export function BlogFeedWrapper({ preloadedData }: { preloadedData: Preloaded<typeof api.blogs.getPaginatedPostsByType> }) {
  const feedType = useSearchStore((state) => state.feedType);
  const searchTerm = useSearchStore((state) => state.searchTerm);
  const activeTags = useSearchStore((state) => state.activeTags);
  const sortOrder = useSearchStore((state) => state.sortOrder);

  const initialData = usePreloadedQuery(preloadedData);
  const [visitedFeeds, setVisitedFeeds] = useState<Set<FeedType>>(() => new Set([feedType]));

  if (!visitedFeeds.has(feedType)) {
    setVisitedFeeds((prev) => new Set(prev).add(feedType));
  }

  return (
    <>
      {FEEDS.map((feed) => {
        const isActive = feedType === feed.id;
        const hasBeenVisited = visitedFeeds.has(feed.id);

        if (!hasBeenVisited) return null;

        return (
          <div
            key={feed.id}
            className={isActive ? "flex flex-col flex-1 h-full min-h-0" : "hidden"}
          >
            <BlogFeed
              postType={feed.dbPostType}
              myFeed={feed.myFeed}
              searchTerm={searchTerm}
              activeTags={activeTags}
              sortOrder={sortOrder}
              isActive={isActive}
              isInitialFeed={feed.id === "all"}
              preloadedData={feed.id === "all" ? initialData : undefined}
            />
          </div>
        );
      })}
    </>
  );
}