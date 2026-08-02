"use client";

import Link from "next/link"; 
import { LiveMetrics } from "./LiveMetrics";
import { api } from "@/convex/_generated/api";
import { FunctionReturnType } from "convex/server";
import { TrendingUp } from "lucide-react";
import { SidebarGroupLabel } from "../ui/sidebar";

type TrendingBlog = FunctionReturnType<typeof api.blogs.getTrendingPosts>[number];

interface TrendingBlogsClientProps {
    initialTrendingBlogs: TrendingBlog[];
}

export function TrendingBlogsClient({ initialTrendingBlogs }: TrendingBlogsClientProps) {
    if (initialTrendingBlogs.length === 0) {
        return <></>;
    }

    return (
        <div className="w-full flex flex-col">
            <SidebarGroupLabel className="w-full justify-center">
                <h1 className="flex items-center justify-center gap-2 text-sm font-medium text-foreground">
                    <TrendingUp className="w-4 h-4 md:w-4 md:h-4 stroke-[2.3] shrink-0" />
                    <span>Trending</span>
                </h1>
            </SidebarGroupLabel>
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