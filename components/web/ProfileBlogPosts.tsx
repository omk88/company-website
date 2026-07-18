"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";

interface ProfileBlogPostsProps {
  preloadedInitialBlogs: Preloaded<typeof api.blogs.getPaginatedPostsByAuthor>;
}

export function ProfileBlogPosts({ preloadedInitialBlogs }: ProfileBlogPostsProps) {
  const initialData = usePreloadedQuery(preloadedInitialBlogs);

  return (
    <div className="space-y-4">
      {initialData.page.length === 0 ? (
        <p className="text-muted-foreground">No blogs posted yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {initialData.page.map((blog) => (
            <li key={blog._id} className="p-4 border rounded-xl shadow-sm bg-card">
              <h3 className="text-lg font-semibold">{blog.title}</h3>
              <p className="text-muted-foreground mt-1">{blog.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}