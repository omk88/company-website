"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type FeedType = "home" | "popular" |"team" | "community";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState("new");
  const [feedType, setFeedType] = useState<FeedType>("home");

  return (
    <SearchContext.Provider 
      value={{ 
        searchTerm, setSearchTerm, 
        activeTags, setActiveTags, 
        sortOrder, setSortOrder,
        feedType, setFeedType,
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