"use client";

import Link from "next/link"; 
import { LiveMetrics } from "./LiveMetrics";
import { BlogPostPreview } from "./BlogCard";

interface TrendingBlogItem extends BlogPostPreview {
    commentCount: number;
    recentViews: number;
}

interface TrendingBlogsClientProps {
    initialTrendingBlogs: TrendingBlogItem[];
}

export function TrendingBlogsClient({ initialTrendingBlogs }: TrendingBlogsClientProps) {
    if (initialTrendingBlogs.length === 0) {
        return <p className="text-sm text-muted-foreground p-2">No trending posts in the last 7 days.</p>;
    }

    return (
        <div className="w-full flex flex-col">
            <ul className="list-none w-full m-0 p-0 space-y-3">
                {initialTrendingBlogs.map((blog) => (
                    <li key={blog._id} className="w-full block">
                        <Link 
                            href={`/insights/${blog._id}`} 
                            className="group/trending block w-full text-inherit no-underline cursor-pointer p-3 rounded-2xl bg-muted/50 hover:bg-muted/80 transition-all duration-100"
                        >
                            <div className="w-full flex flex-col gap-1">
                                <div className="overflow-hidden">
                                    <h3 className="break-words text-sm font-semibold tracking-tight line-clamp-2 text-foreground transition-colors duration-200 group-hover/trending:text-blue-600 leading-snug">
                                        {blog.title}
                                    </h3>
                                </div>
                                
                                <div className="-ml-5 w-[110%] scale-90 origin-left opacity-80 group-hover/trending:opacity-100 transition-opacity duration-200 transform-gpu will-change-opacity">
                                    <LiveMetrics 
                                        views={blog.totalViews ?? 0} 
                                        likes={blog.likes ?? 0} 
                                        comments={blog.commentCount ?? 0} 
                                        showDislikes={false}
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