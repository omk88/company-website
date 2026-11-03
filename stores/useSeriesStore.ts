import { create } from "zustand";
import { Doc } from "@/convex/_generated/dataModel";

interface SeriesState {
  seriesTitle: string;
  description: string;
  stagedBlogs: Doc<"blogs">[];
  setSeriesTitle: (title: string) => void;
  setDescription: (desc: string) => void;
  setStagedBlogs: (blogs: Doc<"blogs">[]) => void;
  hydrateSeries: (data: { title: string; description?: string; blogs: Doc<"blogs">[] }) => void;
  resetSeries: () => void;
}

export const useSeriesStore = create<SeriesState>((set) => ({
  seriesTitle: "",
  description: "",
  stagedBlogs: [],
  setSeriesTitle: (title) => set({ seriesTitle: title }),
  setDescription: (description) => set({ description }),
  setStagedBlogs: (stagedBlogs) => set({ stagedBlogs }),
  hydrateSeries: ({ title, description, blogs }) => 
    set({ seriesTitle: title, description: description || "", stagedBlogs: blogs }),
  resetSeries: () => set({ seriesTitle: "", description: "", stagedBlogs: [] }),
}));