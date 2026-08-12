"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
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

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
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
    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const newSearch = params.toString();
    const newUrl = newSearch ? `${window.location.pathname}?${newSearch}` : window.location.pathname;
    
    window.history.replaceState(null, "", newUrl);
  };

  const setFeedType = (type: FeedType) => {
    setFeedTypeState(type);
    updateUrlParam("feed", type === "all" ? null : type);
  };

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
      setActiveTagsState(params.get("tags") ? params.get("tags")!.split(",") : []);
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
  if (!context) throw new Error("useLocalSearch must be used within a SearchProvider");
  return context;
}