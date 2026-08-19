"use client";

import { useMetricStore } from "@/stores/useMetricStore";
import { ProfileBlogs } from "./ProfileBlogs";
import { ProfileComments } from "./ProfileComments";
import { ProfileBookmarks } from "./ProfileBookmarks";
import { ProfileFollows } from "./ProfileFollows";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface ProfileContentProps {
  preloadedProfile: Preloaded<typeof api.profiles.getProfileByUsername>;
  preloadedCurrentUser: Preloaded<typeof api.auth.getCurrentUser>;
}

export function ProfileContent({ preloadedProfile, preloadedCurrentUser }: ProfileContentProps) {

  const profileData = usePreloadedQuery(preloadedProfile);
  const currentUser = usePreloadedQuery(preloadedCurrentUser);

  const selectedMetric = useMetricStore((state) => state.selectedMetric);

  const components = {
    insights: <ProfileBlogs profile={profileData} />,
    comments: <ProfileComments profile={profileData} />,
    bookmarks: <ProfileBookmarks profile={profileData} />,
    followers: <ProfileFollows profile={profileData} />
  };

  return (
    <div className="flex flex-col flex-1 w-full max-w-[600px] p-2">
      {components[selectedMetric as keyof typeof components] || <ProfileBlogs profile={profileData} />}
    </div>
  );
}