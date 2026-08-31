"use client";

import { useEffect } from "react";
import { useBlogStore, Blog } from "@/stores/useBlogStore";

export function BlogStoreHydrator({ blog }: { blog: Blog | null }) {
  const setSelectedBlog = useBlogStore((state) => state.setSelectedBlog);

  useEffect(() => {
    setSelectedBlog(blog);
  }, [blog, setSelectedBlog]);

  return null;
}