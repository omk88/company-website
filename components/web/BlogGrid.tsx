"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BlogCard } from "./BlogCard";

interface BlogGridProps {
    preloadedBlogs: Preloaded<typeof api.blogs.getPosts>;
}

export function BlogGrid({ preloadedBlogs }: BlogGridProps) {
    const livePosts = usePreloadedQuery(preloadedBlogs);

    if (!livePosts || livePosts.length === 0) {
        return (
            <div className="text-center py-20 border border-dashed rounded-lg my-12">
                <p className="text-muted-foreground">No blog insights published yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 my-12">
            {livePosts.map((post) => (
                <BlogCard key={post._id} post={post} />
            ))}
        </div>
    );
}