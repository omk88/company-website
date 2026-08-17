import { create } from 'zustand';

type MetricType = 'insights' | 'comments' | 'bookmarks' | 'followers';

interface MetricState {
  selectedMetric: MetricType;
  setSelectedMetric: (metric: MetricType) => void;
}

export const useMetricStore = create<MetricState>((set) => ({
  selectedMetric: 'insights',
  setSelectedMetric: (metric) => set({ selectedMetric: metric }),
}));