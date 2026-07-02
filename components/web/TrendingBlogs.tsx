"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link"; 

export function TrendingBlogs() {
    const trendingBlogs = useQuery(api.blogs.getTrendingPosts);

    if (trendingBlogs === undefined) {
        return <div className="h-24 w-full bg-muted animate-pulse rounded" />;
    }

    if (trendingBlogs.length === 0) {
        return <p className="text-sm text-muted-foreground">No trending posts in the last 7 days.</p>;
    }

    return (
        <div className="py-2 px-0.5 flex flex-col gap-3">
            <ul className="list-none space-y-3">
                {trendingBlogs.map((blog) => (
                    <li key={blog._id}>
                        <Link 
                            href={`/insights/${blog._id}`} 
                            className="group/trending block text-inherit no-underline cursor-pointer"
                        >
                            <div className="flex flex-col">
                                <h3 className="break-all text-sm font-semibold tracking-tight line-clamp-1 text-foreground transition-colors duration-200 group-hover/trending:text-blue-600 leading-tight">
                                    {blog.title}
                                </h3>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}