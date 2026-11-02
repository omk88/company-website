import { create } from "zustand";
import { Doc } from "@/convex/_generated/dataModel";

interface SeriesState {
  stagedBlogs: Doc<"blogs">[];
  seriesTitle: string;
  description: string;
  setStagedBlogs: (updater: Doc<"blogs">[] | ((prev: Doc<"blogs">[]) => Doc<"blogs">[])) => void;
  setSeriesTitle: (title: string) => void;
  setDescription: (description: string) => void;
}

export const useSeriesStore = create<SeriesState>((set) => ({
  stagedBlogs: [],
  seriesTitle: "",
  description: "",
  setStagedBlogs: (updater) =>
    set((state) => ({
      stagedBlogs: typeof updater === "function" ? updater(state.stagedBlogs) : updater,
    })),
  setSeriesTitle: (seriesTitle) => set({ seriesTitle }),
  setDescription: (description) => set({ description }),
}));