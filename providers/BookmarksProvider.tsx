"use client";

import { createContext, useContext, ReactNode, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface BookmarksContextType {
  bookmarkedIds: Set<string>;
  isLoading: boolean;
  isBookmarked: (blogId: string) => boolean;
}

const BookmarksContext = createContext<BookmarksContextType>({
  bookmarkedIds: new Set(),
  isLoading: true,
  isBookmarked: () => false,
});

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const bookmarkIdsArray = useQuery(api.blogs.getUserBookmarkIds);

  const bookmarkedIds = useMemo(() => {
    return new Set<string>(bookmarkIdsArray ?? []);
  }, [bookmarkIdsArray]);

  const isBookmarked = (blogId: string) => bookmarkedIds.has(blogId);

  return (
    <BookmarksContext.Provider
      value={{
        bookmarkedIds,
        isLoading: bookmarkIdsArray === undefined,
        isBookmarked,
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}

export const useBookmarks = () => useContext(BookmarksContext);