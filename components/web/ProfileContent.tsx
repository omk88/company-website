"use client";

import { useMetricStore } from "@/stores/useMetricStore";
import { ProfileBlogs } from "./ProfileBlogs";
import { ProfileComments } from "./ProfileComments";
import { ProfileBookmarks } from "./ProfileBookmarks";
import { ProfileFollowers } from "./ProfileFollowers";
import { Id } from "@/convex/_generated/dataModel";

interface ProfileContentProps {
  author: string | undefined;
  profileId: Id<"profiles"> | undefined;
  profilePicture: string | null;
  defaultProfilePicture: string | null;
}

export function ProfileContent({ author, profileId, profilePicture, defaultProfilePicture }: ProfileContentProps) {
  const selectedMetric = useMetricStore((state) => state.selectedMetric);

  const components = {
    insights: <ProfileBlogs author={author} />,
    comments: <ProfileComments author={author} />,
    bookmarks: <ProfileBookmarks author={author} />,
    followers: <ProfileFollowers profileId={profileId} profilePicture={profilePicture} defaultProfilePicture={defaultProfilePicture} />
  };

  return (
    <div className="flex flex-col flex-1 w-full max-w-[600px] p-2">
      {components[selectedMetric as keyof typeof components] || <ProfileBlogs author={author} />}
    </div>
  );
}