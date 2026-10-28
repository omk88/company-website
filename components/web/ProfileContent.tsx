"use client";

import { useState } from "react";
import { ProfileBlogs } from "./ProfileBlogs";
import { ProfileComments } from "./ProfileComments";
import { ProfileBookmarks } from "./ProfileBookmarks";
import { ProfileFollowers } from "./ProfileFollowers";
import { ProfileFollowing } from "./ProfileFollowing";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useProfileStore } from "@/stores/useProfileStore";
import { useEffect } from "react";
import { ProfileArticleSeries } from "@/app/(shared-layout)/[username]/_components/ProfileArticleSeries";

interface ProfileContentProps {
  preloadedProfile: Preloaded<typeof api.profiles.getProfileByUsername>;
  preloadedCurrentUser: Preloaded<typeof api.auth.getCurrentUser>;
  preloadedBlogs: Preloaded<typeof api.blogs.getPaginatedPostsByAuthor> | null;
}

function ProfileBlogsWrapper({
  profile,
  preloadedBlogs,
}: {
  profile: any;
  preloadedBlogs: Preloaded<typeof api.blogs.getPaginatedPostsByAuthor> | null;
}) {
  if (!preloadedBlogs) {
    return <ProfileBlogs profile={profile} preloadedData={null} />;
  }

  return <ProfileBlogsWithData profile={profile} preloadedBlogs={preloadedBlogs} />;
}

function ProfileBlogsWithData({
  profile,
  preloadedBlogs,
}: {
  profile: any;
  preloadedBlogs: Preloaded<typeof api.blogs.getPaginatedPostsByAuthor>;
}) {
  const initialData = usePreloadedQuery(preloadedBlogs);
  return <ProfileBlogs profile={profile} preloadedData={initialData} />;
}

export function ProfileContent({ 
  preloadedProfile, 
  preloadedCurrentUser, 
  preloadedBlogs,
}: ProfileContentProps) {
  const profileData = usePreloadedQuery(preloadedProfile);
  const currentUser = usePreloadedQuery(preloadedCurrentUser);

  const selectedMetric = useProfileStore((state) => state.selectedMetric);
  const setSelectedMetric = useProfileStore((state) => state.setSelectedMetric);

  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(() => new Set([selectedMetric]));

  if (!visitedTabs.has(selectedMetric)) {
    setVisitedTabs((prev) => new Set(prev).add(selectedMetric));
  }

  useEffect(() => {
    return () => {
      setSelectedMetric("insights");
    };
  }, [setSelectedMetric]);

  return (
    <div className="w-full flex flex-col flex-1 h-full">
      {(visitedTabs.has("insights") || selectedMetric === "insights") && (
        <div className={selectedMetric === "insights" ? "flex flex-col flex-1 w-full h-full" : "hidden"}>
          <ProfileBlogsWrapper profile={profileData} preloadedBlogs={preloadedBlogs} />
        </div>
      )}

      {(visitedTabs.has("series") || selectedMetric === "series") && (
        <div className={selectedMetric === "series" ? "flex flex-col flex-1 w-full h-full" : "hidden"}>
          <ProfileArticleSeries profile={profileData} />
        </div>
      )}

      {(visitedTabs.has("comments") || selectedMetric === "comments") && (
        <div className={selectedMetric === "comments" ? "flex flex-col flex-1 w-full h-full" : "hidden"}>
          <ProfileComments profile={profileData} />
        </div>
      )}

      {(visitedTabs.has("bookmarks") || selectedMetric === "bookmarks") && (
        <div className={selectedMetric === "bookmarks" ? "flex flex-col flex-1 w-full h-full" : "hidden"}>
          <ProfileBookmarks profile={profileData} />
        </div>
      )}

      {(visitedTabs.has("followers") || selectedMetric === "followers") && (
        <div className={selectedMetric === "followers" ? "flex flex-col flex-1 w-full" : "hidden"}>
          <ProfileFollowers profile={profileData} currentUser={currentUser} />
        </div>
      )}

      {(visitedTabs.has("following") || selectedMetric === "following") && (
        <div className={selectedMetric === "following" ? "flex flex-col flex-1 w-full" : "hidden"}>
          <ProfileFollowing profile={profileData} currentUser={currentUser} />
        </div>
      )}
    </div>
  );
}