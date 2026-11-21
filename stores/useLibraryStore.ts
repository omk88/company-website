import { create } from "zustand";

export type LibraryMetricType = "courses";

interface LibraryState {
  selectedMetric: LibraryMetricType;
  setSelectedMetric: (metric: LibraryMetricType) => void;
  resetMetric: () => void;
}

export const useLibraryStore = create<LibraryState>((set) => ({
  selectedMetric: "courses",
  setSelectedMetric: (selectedMetric) => set({ selectedMetric }),
  resetMetric: () => set({ selectedMetric: "courses" }),
}));