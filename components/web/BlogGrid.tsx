"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BlogCard } from "./BlogCard";

export function BlogGrid() {
    const livePosts = useQuery(api.blogs.getPosts);

    if (livePosts === undefined) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 my-12 animate-pulse">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-4">
                        <div className="aspect-video w-full bg-muted rounded-md" />
                        <div className="h-4 w-1/3 bg-muted rounded" />
                        <div className="h-6 w-3/4 bg-muted rounded" />
                        <div className="h-4 w-full bg-muted rounded" />
                    </div>
                ))}
            </div>
        );
    }

    if (livePosts.length === 0) {
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