"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, Eye, MessageSquare, Sparkles, ThumbsUp } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { FunctionReturnType } from "convex/server";
import { ProfileHoverCard } from "./ProfileHoverCard";

type FeaturedBlog = FunctionReturnType<typeof api.blogs.getFeaturedPosts>[number];

interface FeaturedBlogsClientProps {
    initialFeaturedBlogs: FeaturedBlog[];
}

export function FeaturedBlogsClient({ initialFeaturedBlogs }: FeaturedBlogsClientProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? initialFeaturedBlogs.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === initialFeaturedBlogs.length - 1 ? 0 : prevIndex + 1
        );
    };

    useEffect(() => {
        if (initialFeaturedBlogs.length <= 1) return;
        const interval = setInterval(handleNext, 100000);
        return () => clearInterval(interval);
    }, [initialFeaturedBlogs.length]);

    if (initialFeaturedBlogs.length === 0) {
        return (<></>);
    }

    const currentPost = initialFeaturedBlogs[currentIndex];
    const formattedDate = new Date(currentPost.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    const compactFormatter = new Intl.NumberFormat("en", {
        notation: "compact",
        compactDisplay: "short",
        maximumFractionDigits: 1,
    });

    return (
        <div className="flex flex-col justify-between w-full bg-muted/50 rounded-2xl p-4 transition-all duration-100 hover:bg-muted">
            <div className="flex items-center justify-between mb-3">
                <h1 className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
                    <Sparkles className="w-3.5 h-3.5 stroke-[2.3] shrink-0" />
                    <span>Featured</span>
                </h1>
                <div className="flex items-center gap-1 text-muted-foreground ">
                    <Button variant="ghost" size="icon" className="h-6 w-6 cursor-pointer" onClick={handlePrev}>
                        <ArrowLeft className="h-3.5 w-3.5" />
                    </Button>
                    <span className="text-xs select-none px-1">
                        {currentIndex + 1}/{initialFeaturedBlogs.length}
                    </span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 cursor-pointer" onClick={handleNext}>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            <Link 
                href={`/insights/${currentPost._id}`}
                className="group/card flex items-start justify-between gap-4 w-full text-inherit no-underline cursor-pointer mb-4"
            >
                <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div>
                        <div className="flex items-center gap-1.5 text-xs font-mono tracking-wider uppercase text-muted-foreground mb-1.5">
                            <ProfileHoverCard authorUsername={currentPost.username} displayName={currentPost.displayName}>
                                <span className="cursor-pointer">{currentPost.displayName || currentPost.username}</span>
                            </ProfileHoverCard>
                                <span>•</span>
                                <span className="shrink-0">{formattedDate}</span>
                        </div>

                        <h3 className="text-sm font-semibold leading-snug tracking-tight text-foreground transition-colors duration-100 group-hover/card:text-blue-600 line-clamp-3">
                            {currentPost.title}
                        </h3>
                    </div>
                </div>

                <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-background">
                    {initialFeaturedBlogs.map((post, index) => (
                        <Image
                            key={post._id}
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            className={`object-cover transition-opacity duration-100 ${
                                index === currentIndex ? "opacity-100 block" : "opacity-0 hidden"
                            }`}
                            sizes="(max-width: 768px) 200px, 300px"
                            priority={index === 0} 
                        />
                    ))}
                </div>
            </Link>

            <div className="text-muted-foreground opacity-75 group-hover/trending:opacity-100 transition-opacity duration-150">
                <div className="flex items-center text-sm text-muted-foreground font-mono tracking-tight select-none">
                    <div className="flex items-center gap-1.5 min-w-[3rem]">
                        <Eye className="w-4 h-4 stroke-[2.3] shrink-0" />
                        <span>{compactFormatter.format(currentPost.totalViews)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-[3rem]">
                        <ThumbsUp className="w-4 h-4 stroke-[2.3] shrink-0" />
                        <span>{compactFormatter.format(currentPost.likes)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-[3rem]">
                        <MessageSquare className="w-4 h-4 stroke-[2.3] shrink-0" />
                        <span>{compactFormatter.format(currentPost.commentCount)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}