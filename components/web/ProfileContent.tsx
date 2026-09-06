"use client";

import { ProfileBlogs } from "./ProfileBlogs";
import { ProfileComments } from "./ProfileComments";
import { ProfileBookmarks } from "./ProfileBookmarks";
import { ProfileFollowers } from "./ProfileFollowers";
import { ProfileFollowing } from "./ProfileFollowing";
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

  return (
    <div className="flex flex-col flex-1">
      <div className={selectedMetric === "insights" ? "block" : "hidden"}>
        <ProfileBlogs profile={profileData} />
      </div>
      <div className={selectedMetric === "comments" ? "block" : "hidden"}>
        <ProfileComments profile={profileData} />
      </div>
      <div className={selectedMetric === "bookmarks" ? "block" : "hidden"}>
        <ProfileBookmarks profile={profileData} />
      </div>
      <div className={selectedMetric === "followers" ? "block" : "hidden"}>
        <ProfileFollowers profile={profileData} currentUser={currentUser} />
      </div>
      <div className={selectedMetric === "following" ? "block" : "hidden"}>
        <ProfileFollowing profile={profileData} currentUser={currentUser} />
      </div>
    </div>
  );
}