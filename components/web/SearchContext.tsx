"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type PostType = "team" | "community";

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeTags: string[];
  setActiveTags: (tags: string[] | ((prev: string[]) => string[])) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  postType: PostType;
  setPostType: (type: PostType) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState("new");
  const [postType, setPostType] = useState<PostType>("team");

  return (
    <SearchContext.Provider 
      value={{ 
        searchTerm, setSearchTerm, 
        activeTags, setActiveTags, 
        sortOrder, setSortOrder,
        postType, setPostType,
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