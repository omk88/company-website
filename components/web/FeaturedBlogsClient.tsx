"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { BlogPostPreview } from "./BlogCard";

interface FeaturedBlogsClientProps {
    initialFeaturedBlogs: BlogPostPreview[];
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
        const interval = setInterval(handleNext, 10000);
        return () => clearInterval(interval);
    }, [initialFeaturedBlogs.length]);

    if (initialFeaturedBlogs.length === 0) {
        return <div className="p-4 text-muted-foreground">No featured posts found.</div>;
    }

    const currentPost = initialFeaturedBlogs[currentIndex];
    const formattedDate = new Date(currentPost.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    return (
        <div className="group/content flex flex-col gap-0 w-full bg-muted rounded-sm overflow-hidden transition-all duration-200 hover:bg-zinc-200 dark:hover:bg-zinc-900">
            <Link 
                href={`/insights/${currentPost._id}`}
                className="flex flex-col w-full text-inherit no-underline cursor-pointer"
            >
                <div className="relative aspect-video w-full overflow-hidden shrink-0">
                    {initialFeaturedBlogs.map((post, index) => (
                        <Image
                            key={post._id}
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            className={`object-cover ${
                                index === currentIndex ? "block" : "hidden"
                            }`}
                            sizes="(max-width: 1200px) 100vw, 1200px"
                            priority={index === 0} 
                        />
                    ))}
                </div>
                
                <div className="pt-3 px-3 pb-2">
                    <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex justify-between">
                        <span>{currentPost.authorName}</span>
                        <span>•</span>
                        <span>{formattedDate}</span>
                    </div>

                    <div className="mt-2 h-[3.25rem] flex flex-col justify-start overflow-hidden">
                        <h3 className="uppercase break-words text-lg font-bold tracking-tight text-foreground transition-colors duration-200 group-hover/content:text-blue-600 leading-snug line-clamp-2">
                            {currentPost.title}
                        </h3>
                    </div>
                </div>
            </Link>

            <div className="flex flex-row justify-center items-center gap-2 border-border/40 px-3 pb-3">
                <Button variant="ghost" size="icon" onClick={handlePrev}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <span className="text-center min-w-[16px] text-muted-foreground font-medium text-sm select-none">
                    {currentIndex + 1}
                </span>
                <Button variant="ghost" size="icon" onClick={handleNext}>
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}