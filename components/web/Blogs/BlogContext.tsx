"use client";

import { createContext, use, ReactNode } from "react";
import { Doc } from "@/convex/_generated/dataModel";

const BlogContext = createContext<Promise<Doc<"blogs"> | null> | null>(null);

export function BlogProvider({
    value,
    children,
}: {
    value: Promise<Doc<"blogs"> | null>;
    children: ReactNode;
}) {
    return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}

export function useBlog() {
    const blogPromise = use(BlogContext);
    if (!blogPromise) throw new Error("useBlog must be used within BlogProvider");

    const blog = use(blogPromise);
    return blog;
}