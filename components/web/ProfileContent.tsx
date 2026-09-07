"use client";

import { ProfileBlogs } from "./ProfileBlogs";
import { ProfileComments } from "./ProfileComments";
import { ProfileBookmarks } from "./ProfileBookmarks";
import { ProfileFollowers } from "./ProfileFollowers";
import { ProfileFollowing } from "./ProfileFollowing";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useProfileStore } from "@/stores/useProfileStore";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    return () => {
      setSelectedMetric("insights");
    };
  }, [setSelectedMetric]);

  return (
    <div className="flex flex-col h-full flex-1">
      <div className={selectedMetric === "insights" ? "flex flex-col flex-1 h-full" : "hidden"}>
        <ProfileBlogsWrapper profile={profileData} preloadedBlogs={preloadedBlogs} />
      </div>

      <div className={selectedMetric === "comments" ? "flex flex-col flex-1 h-full" : "hidden"}>
        <ProfileComments profile={profileData} />
      </div>

      <div className={selectedMetric === "bookmarks" ? "flex flex-col flex-1 h-full" : "hidden"}>
        <ProfileBookmarks profile={profileData} />
      </div>

      <div className={selectedMetric === "followers" ? "flex flex-col flex-1 h-full" : "hidden"}>
        <ProfileFollowers profile={profileData} currentUser={currentUser} />
      </div>

      <div className={selectedMetric === "following" ? "flex flex-col flex-1 h-full" : "hidden"}>
        <ProfileFollowing profile={profileData} currentUser={currentUser} />
      </div>
    </div>
  );
}