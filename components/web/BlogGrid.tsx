"use client";

import { BlogCard, BlogPostPreview } from "./BlogCard";

interface BlogGridProps {
    initialPosts: BlogPostPreview[];
}

export function BlogGrid({ initialPosts }: BlogGridProps) {
    if (!initialPosts || initialPosts.length === 0) {
        return (
            <div className="text-center py-20 border border-dashed rounded-lg my-12">
                <p className="text-muted-foreground">No blog insights published yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 my-12">
            {initialPosts.map((post, index) => (
                <BlogCard key={post._id} post={post} index={index} />
            ))}
        </div>
    );
}