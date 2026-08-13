"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
  Suspense,
} from "react";
import { useSearchParams } from "next/navigation";

export type FeedType = "all" | "popular" | "team" | "community";

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeTags: string[];
  setActiveTags: (tags: string[] | ((prev: string[]) => string[])) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  feedType: FeedType;
  setFeedType: (type: FeedType) => void;
}

const defaultContext: SearchContextType = {
  searchTerm: "",
  setSearchTerm: () => {},
  activeTags: [],
  setActiveTags: () => {},
  sortOrder: "new",
  setSortOrder: () => {},
  feedType: "all",
  setFeedType: () => {},
};

const SearchContext = createContext<SearchContextType>(defaultContext);

export function SearchProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<SearchContext.Provider value={defaultContext}>{children}</SearchContext.Provider>}>
      <SearchProviderInner>{children}</SearchProviderInner>
    </Suspense>
  );
}

function SearchProviderInner({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();

  const [feedType, setFeedTypeState] = useState<FeedType>(
    () => (searchParams.get("feed") as FeedType) || "all"
  );
  const [searchTerm, setSearchTermState] = useState(
    () => searchParams.get("q") || ""
  );
  const [sortOrder, setSortOrderState] = useState(
    () => searchParams.get("sort") || "new"
  );
  const [activeTags, setActiveTagsState] = useState<string[]>(
    () => (searchParams.get("tags") ? searchParams.get("tags")!.split(",") : [])
  );

  const updateUrlParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(window.location.search);
    const currentValue = params.get(key);

    if ((value === null && !params.has(key)) || currentValue === value) {
      return;
    }

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const newSearch = params.toString();
    const newUrl = newSearch
      ? `${window.location.pathname}?${newSearch}`
      : window.location.pathname;

    window.history.replaceState(null, "", newUrl);
  };

  const setFeedType = useCallback((type: FeedType) => {
    setFeedTypeState((prev) => {
      if (prev === type) return prev;
      updateUrlParam("feed", type === "all" ? null : type);
      return type;
    });
  }, []);

  const setSearchTerm = (term: string) => {
    setSearchTermState(term);
    updateUrlParam("q", term.trim() || null);
  };

  const setSortOrder = (order: string) => {
    setSortOrderState(order);
    updateUrlParam("sort", order === "new" ? null : order);
  };

  const setActiveTags = (tags: string[] | ((prev: string[]) => string[])) => {
    const nextTags = typeof tags === "function" ? tags(activeTags) : tags;
    setActiveTagsState(nextTags);
    updateUrlParam("tags", nextTags.length > 0 ? nextTags.join(",") : null);
  };

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setFeedTypeState((params.get("feed") as FeedType) || "all");
      setSearchTermState(params.get("q") || "");
      setSortOrderState(params.get("sort") || "new");
      setActiveTagsState(
        params.get("tags") ? params.get("tags")!.split(",") : []
      );
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        activeTags,
        setActiveTags,
        sortOrder,
        setSortOrder,
        feedType,
        setFeedType,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useLocalSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useLocalSearch must be used within a SearchProvider");
  }
  return context;
}