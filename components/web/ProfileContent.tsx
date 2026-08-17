"use client";

import { useMetricStore } from "@/stores/useMetricStore";
import { ProfileBlogs } from "./ProfileBlogs";
import { ProfileComments } from "./ProfileComments";

interface ProfileContentProps {
  author: string | undefined;
}

export function ProfileContent({ author }: ProfileContentProps) {
  const selectedMetric = useMetricStore((state) => state.selectedMetric);

  const components = {
    insights: <ProfileBlogs author={author} />,
    comments: <ProfileComments author={author} />,
  };

  return (
    <div className="flex flex-col flex-1 w-full max-w-[600px] p-2">
      {components[selectedMetric as keyof typeof components] || <ProfileBlogs author={author} />}
    </div>
  );
}