"use client";

import Link from "next/link"; 
import { LiveMetrics } from "./LiveMetrics";
import { BlogPostPreview } from "./BlogCard";

interface TrendingBlogsClientProps {
    initialTrendingBlogs: BlogPostPreview[];
}

export function TrendingBlogsClient({ initialTrendingBlogs }: TrendingBlogsClientProps) {
    if (initialTrendingBlogs.length === 0) {
        return <p className="text-sm text-muted-foreground p-2">No trending posts in the last 7 days.</p>;
    }

    return (
        <div className="w-full flex flex-col">
            <ul className="list-none w-full m-0 p-0">
                {initialTrendingBlogs.map((blog) => (
                    <li key={blog._id} className="w-full block">
                        <Link 
                            href={`/insights/${blog._id}`} 
                            className="group/trending block w-full text-inherit no-underline cursor-pointer p-2 rounded transition-all duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 bg-transparent"
                        >
                            <div className="w-full flex flex-col gap-1">
                                <div className="overflow-hidden">
                                    <h3 className="uppercase break-words text-sm font-semibold tracking-tight line-clamp-2 text-foreground transition-colors duration-200 group-hover/trending:text-blue-600 leading-snug">
                                        {blog.title}
                                    </h3>
                                </div>
                                
                                <div className="-ml-6 scale-90 origin-left opacity-80 group-hover/trending:opacity-100 transition-opacity duration-200 transform-gpu will-change-opacity">
                                    <LiveMetrics 
                                        postId={blog._id} 
                                        initialViews={blog.totalViews} 
                                        initialLikes={blog.likes} 
                                        initialDislikes={blog.dislikes} 
                                    />
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}