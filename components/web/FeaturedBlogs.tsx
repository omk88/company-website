"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";

export function FeaturedBlogs() {

    const featuredBlogList = useQuery(api.blogs.getFeaturedPosts);
    const featuredBlogs = featuredBlogList ?? [];

    if (featuredBlogs === undefined) {
        return <div className="min-h-[220px] bg-muted animate-pulse" />; 
    }

    if (featuredBlogs.length === 0) {
        return <div className="p-4 text-muted-foreground">No featured posts found.</div>;
    }

    const mainPost = featuredBlogs[0];

    const formattedDate = new Date(mainPost.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    return (
        <div className="mt-2 w-full">
            <div className="relative aspect-video w-full overflow-hidden bg-muted border border-border/50 shrink-0">
                <Image
                    src={mainPost.imageUrl}
                    alt={mainPost.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    priority
                />
            </div>
            <div className="flex flex-col flex-1 justify-between p-2">
                <div>
                <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    <h1>{mainPost.author}</h1>
                    <h1>{formattedDate}</h1>
                </div>

                <div>
                    <h3 className="break-words text-lg md:text-lg font-bold tracking-tight line-clamp-2 text-foreground transition-colors duration-200 group-hover:text-primary">
                    {mainPost.title}
                    </h3>
                    <p className="break-words text-muted-foreground line-clamp-2 md:line-clamp-3 leading-relaxed text-sm">
                    {mainPost.subtitle}
                    </p>
                </div>
            </div>
        </div>
    </div>
    )
}