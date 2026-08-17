"use client";

import { ProfileFeed } from "./ProfileFeed";

interface ProfileBlogPostsProps {
  author: string | undefined;
}

export function ProfileBlogPosts({ author }: ProfileBlogPostsProps) {
  return (
    <div className="flex flex-col flex-1 w-full max-w-[600px] p-2 mx-auto">
      <ProfileFeed author={author} />
    </div>
  );
}