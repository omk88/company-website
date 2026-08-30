import { create } from "zustand";

export type ProfileMetricType = "insights" | "comments" | "bookmarks" | "followers" | "following";

interface ProfileState {
  selectedMetric: ProfileMetricType;
  setSelectedMetric: (metric: ProfileMetricType) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  selectedMetric: "insights",
  setSelectedMetric: (selectedMetric) => set({ selectedMetric }),
}));