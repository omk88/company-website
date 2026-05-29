"use client";

import { useReportWebVitals } from "next/web-vitals";

export function PerformanceTracker() {
  useReportWebVitals((metric) => {
    console.log(`${metric.name}: ${metric.value}ms`);
  });

  return null;
}