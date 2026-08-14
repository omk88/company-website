"use client";

import { BlogFeed } from "./BlogFeed";
import { useSearchStore, FeedType } from "@/stores/useSearchStore";

const FEEDS: { id: FeedType; dbPostType?: "community" | "team"; isPopularOnly?: boolean }[] = [
  { id: "all" },
  { id: "popular", isPopularOnly: true },
  { id: "team", dbPostType: "team" },
  { id: "community", dbPostType: "community" },
];

export function PageBlogPosts() {
  const feedType = useSearchStore((state) => state.feedType);
  const searchTerm = useSearchStore((state) => state.searchTerm);
  const activeTags = useSearchStore((state) => state.activeTags);
  const sortOrder = useSearchStore((state) => state.sortOrder);

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