import { create } from "zustand";

export type FeedType = "all" | "popular" | "team" | "community";

interface SearchState {
    searchTerm: string;
    activeTags: string[];
    sortOrder: string;
    feedType: FeedType;

    setSearchTerm: (term: string) => void;
    setActiveTags: (tags: string[] | ((prev: string[]) => string[])) => void;
    setSortOrder: (order: string) => void;
    setFeedType: (type: FeedType) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
    searchTerm: "",
    activeTags: [],
    sortOrder: "new",
    feedType: "all",

    setSearchTerm: (searchTerm) => set({ searchTerm }),

    setActiveTags: (tags) => 
        set((state) => ({
            activeTags: typeof tags === "function" ? tags(state.activeTags) : tags,
        })),

    setSortOrder: (sortOrder) => set({ sortOrder }),

    setFeedType: (feedType) => set({ feedType }),
}));