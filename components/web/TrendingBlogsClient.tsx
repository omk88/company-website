"use client";

import Link from "next/link"; 
import { api } from "@/convex/_generated/api";
import { FunctionReturnType } from "convex/server";
import { Eye, MessageSquare, ThumbsUp, TrendingUp } from "lucide-react";
import { SidebarGroupLabel } from "../ui/sidebar";
import Image from "next/image";

type TrendingBlog = FunctionReturnType<typeof api.blogs.getTrendingPosts>[number];

interface TrendingBlogsClientProps {
    initialTrendingBlogs: TrendingBlog[];
}

const compactFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 1,
});

export function TrendingBlogsClient({ initialTrendingBlogs }: TrendingBlogsClientProps) {
    if (initialTrendingBlogs.length === 0) {
        return null;
    }

    return (
        <div className="w-full flex flex-col">
            <SidebarGroupLabel className="w-full justify-center mb-1">
                <h1 className="flex items-center justify-center gap-2 text-sm font-medium text-foreground">
                    <TrendingUp className="w-4 h-4 stroke-[2.3] shrink-0" />
                    <span>Trending</span>
                </h1>
            </SidebarGroupLabel>
            
            <ul className="list-none w-full m-0 p-0 space-y-2">
                {initialTrendingBlogs.map((blog) => (
                    <li key={blog._id} className="w-full block">
                        <Link 
                            href={`/insights/${blog._id}`} 
                            className="group/trending block w-full text-inherit no-underline cursor-pointer p-2 px-3 rounded-xl bg-muted/50 hover:bg-muted dark:bg-muted/30 dark:hover:bg-muted/60 transition-colors duration-150"
                        >
                            <div className="w-full flex flex-row items-center justify-between gap-3">
                                
                                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                                    <h3 className="break-words text-[13px] font-semibold tracking-tight line-clamp-2 text-foreground/90 transition-colors duration-150 group-hover/trending:text-blue-600 leading-snug">
                                        {blog.title}
                                    </h3>
                                    
                                    <div className="text-muted-foreground opacity-75 group-hover/trending:opacity-100 transition-opacity duration-150">
                                        <div className="flex items-center text-sm text-muted-foreground font-mono tracking-tight select-none">
                                            <div className="flex items-center gap-1.5 min-w-[3rem]">
                                                <Eye className="w-4 h-4 stroke-[2.3] shrink-0" />
                                                <span>{compactFormatter.format(blog.totalViews)}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 min-w-[3rem]">
                                                <ThumbsUp className="w-4 h-4 stroke-[2.3] shrink-0" />
                                                <span>{compactFormatter.format(blog.likes)}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 min-w-[3rem]">
                                                <MessageSquare className="w-4 h-4 stroke-[2.3] shrink-0" />
                                                <span>{compactFormatter.format(blog.commentCount)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-lg bg-muted border border-border/40">
                                    <Image
                                        src={blog.imageUrl}
                                        alt={blog.title}
                                        fill
                                        sizes="48px"
                                        className="object-cover"
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