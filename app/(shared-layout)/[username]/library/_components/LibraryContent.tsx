"use client";

import { useState } from "react";
import { LibraryCourses } from "./LibraryCourses";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import { useLibraryStore } from "@/stores/useLibraryStore";

interface LibraryContentProps {
  preloadedProfile: Preloaded<typeof api.profiles.getProfileByUsername>;
  preloadedCourses: Preloaded<typeof api.courses.getPaginatedPurchasesByAuthor> | null;
}

function ProfileCoursesWrapper({
  profile,
  preloadedCourses,
}: {
  profile: any;
  preloadedCourses: Preloaded<typeof api.courses.getPaginatedPurchasesByAuthor> | null;
}) {
  if (!preloadedCourses) {
    return <LibraryCourses profile={profile} preloadedData={null} />;
  }

  return <ProfileCoursesWithData profile={profile} preloadedCourses={preloadedCourses} />;
}

function ProfileCoursesWithData({
  profile,
  preloadedCourses,
}: {
  profile: any;
  preloadedCourses: Preloaded<typeof api.courses.getPaginatedPurchasesByAuthor>;
}) {
  const initialData = usePreloadedQuery(preloadedCourses);
  return <LibraryCourses profile={profile} preloadedData={initialData} />;
}

export function LibraryContent({ 
  preloadedProfile, 
  preloadedCourses,
}: LibraryContentProps) {
  const profileData = usePreloadedQuery(preloadedProfile);

  const selectedMetric = useLibraryStore((state) => state.selectedMetric);
  const setSelectedMetric = useLibraryStore((state) => state.setSelectedMetric);

  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(() => new Set([selectedMetric]));

  if (!visitedTabs.has(selectedMetric)) {
    setVisitedTabs((prev) => new Set(prev).add(selectedMetric));
  }

  useEffect(() => {
    return () => {
      setSelectedMetric("courses");
    };
  }, [setSelectedMetric]);

  return (
    <div className="w-full flex flex-col flex-1 h-full">
      {(visitedTabs.has("courses") || selectedMetric === "courses") && (
        <div className={selectedMetric === "courses" ? "flex flex-col flex-1 w-full h-full" : "hidden"}>
          <ProfileCoursesWrapper profile={profileData} preloadedCourses={preloadedCourses} />
        </div>
      )}
    </div>
  );
}