"use client";

import { useLocalSearch, FeedType } from "./SearchContext";
import { BlogFeed } from "./BlogFeed";

const FEEDS: { id: FeedType; dbPostType?: "community" | "team"; isPopularOnly?: boolean }[] = [
  { id: "all" },
  { id: "popular", isPopularOnly: true },
  { id: "team", dbPostType: "team" },
  { id: "community", dbPostType: "community" },
];

export function PageBlogPosts() {
  const { feedType, searchTerm, activeTags, sortOrder } = useLocalSearch();

  return (
    <div className="space-y-4 p-2">
      {FEEDS.map((feed) => {
        const isActive = feedType === feed.id;

        return (
          <div key={feed.id} className={isActive ? "block" : "hidden"}>
            <BlogFeed
              postType={feed.dbPostType}
              isPopularOnly={feed.isPopularOnly}
              searchTerm={searchTerm}
              activeTags={activeTags}
              sortOrder={sortOrder}
              isActive={isActive}
            />
          </div>
        );
      })}
    </div>
  );
}