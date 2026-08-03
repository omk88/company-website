"use client";

import Link from "next/link"; 
import { LiveMetrics } from "./LiveMetrics";
import { api } from "@/convex/_generated/api";
import { FunctionReturnType } from "convex/server";
import { SidebarGroupLabel } from "../ui/sidebar";
import { Library } from "lucide-react";
import { ProfileHoverCard } from "./ProfileHoverCard";
import Image from "next/image";
import { Id } from "@/convex/_generated/dataModel";

type MoreFromBlog = FunctionReturnType<typeof api.blogs.getPostsByAuthor>[number];

interface MoreFromClientProps {
    initialBlogs: MoreFromBlog[];
    displayName: string | undefined;
    username: string;
}

export function MoreFromClient({ initialBlogs, displayName, username }: MoreFromClientProps) {
    if (initialBlogs.length === 0) {
        return (<></>);
    }

    return (
        <div className="w-full flex flex-col">
            <SidebarGroupLabel className="w-full justify-center">
                <h1 className="flex justify-center gap-2 p-4 text-sm font-medium text-foreground whitespace-nowrap">
                    <Library className="size-4 stroke-[2.3] shrink-0 mt-0.5" />
                    <span>More from </span>
                    <ProfileHoverCard authorUsername={username} displayName={displayName}>
                        <span className="cursor-pointer">{displayName || username}</span>
                    </ProfileHoverCard>
                </h1>
            </SidebarGroupLabel>
            <ul className="list-none w-full m-0 p-0 space-y-3">
                {initialBlogs.map((blog) => (
                    <li key={blog._id} className="w-full block">
                        <Link 
                            href={`/insights/${blog._id}`} 
                            className="group/trending block w-full text-inherit no-underline cursor-pointer p-3 rounded-2xl bg-muted transition-all duration-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
                        >
                            <div className="w-full flex flex-row items-center justify-between gap-3">
                                <div className="w-full flex flex-col gap-1">
                                    <div className="overflow-hidden">
                                        <h3 className="break-words text-sm font-semibold tracking-tight line-clamp-2 text-foreground transition-colors duration-100 group-hover/trending:text-blue-600 leading-snug">
                                            {blog.title}
                                        </h3>
                                    </div>
                                    
                                    <div className="-ml-5 scale-90 origin-left opacity-80 group-hover/trending:opacity-100 transition-opacity duration-200 transform-gpu will-change-opacity">
                                        <LiveMetrics 
                                            views={blog.totalViews} 
                                            likes={blog.likes} 
                                            comments={blog.commentCount}
                                            showDislikes={false} 
                                        />
                                    </div>
                                </div>

                                <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                                    <Image
                                        src={blog.imageUrl}
                                        alt={blog.title}
                                        fill
                                        sizes="(max-width: 288px) 100px, 150px"
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