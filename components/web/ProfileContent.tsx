"use client";

import { ProfileBlogs } from "./ProfileBlogs";
import { ProfileComments } from "./ProfileComments";
import { ProfileBookmarks } from "./ProfileBookmarks";
import { ProfileFollowers } from "./ProfileFollowers";
import { ProfileFollowing } from "./ProfileFollowing";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useProfileStore } from "@/stores/useProfileStore";
import { useEffect } from "react";

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
    <div className="w-full">
      <div className={selectedMetric === "insights" ? "block w-full" : "hidden"}>
        <ProfileBlogsWrapper profile={profileData} preloadedBlogs={preloadedBlogs} />
      </div>

      <div className={selectedMetric === "comments" ? "block w-full" : "hidden"}>
        <ProfileComments profile={profileData} />
      </div>

      <div className={selectedMetric === "bookmarks" ? "block w-full" : "hidden"}>
        <ProfileBookmarks profile={profileData} />
      </div>

      <div className={selectedMetric === "followers" ? "block w-full" : "hidden"}>
        <ProfileFollowers profile={profileData} currentUser={currentUser} />
      </div>

      <div className={selectedMetric === "following" ? "block w-full" : "hidden"}>
        <ProfileFollowing profile={profileData} currentUser={currentUser} />
      </div>
    </div>
  );
}