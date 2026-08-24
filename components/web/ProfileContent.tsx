"use client";

import { ProfileBlogs } from "./ProfileBlogs";
import { ProfileComments } from "./ProfileComments";
import { ProfileBookmarks } from "./ProfileBookmarks";
import { ProfileFollows } from "./ProfileFollows";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useProfileStore } from "@/stores/useProfileStore";

interface ProfileContentProps {
  preloadedProfile: Preloaded<typeof api.profiles.getProfileByUsername>;
  preloadedCurrentUser: Preloaded<typeof api.auth.getCurrentUser>;
}

export function ProfileContent({ preloadedProfile, preloadedCurrentUser }: ProfileContentProps) {
  const profileData = usePreloadedQuery(preloadedProfile);
  const currentUser = usePreloadedQuery(preloadedCurrentUser);
  const selectedMetric = useProfileStore((state) => state.selectedMetric);

  const renderActiveTab = () => {
    switch (selectedMetric) {
      case "comments":
        return <ProfileComments profile={profileData} />;
      case "bookmarks":
        return <ProfileBookmarks profile={profileData} />;
      case "followers":
        return <ProfileFollows profile={profileData} currentUser={currentUser} />;
      case "insights":
      default:
        return <ProfileBlogs profile={profileData} />;
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full max-w-[600px] p-2">
      {renderActiveTab()}
    </div>
  );
}