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
        return (
            <div className="flex flex-col gap-0 w-full bg-muted rounded-2xl p-4 overflow-hidden">
                <div className="flex items-center justify-center p-6">
                    <span className="text-muted-foreground text-sm font-medium text-center">
                        No featured posts found.
                    </span>
                </div>
            </div>
        );
    }

    const currentPost = initialFeaturedBlogs[currentIndex];
    const formattedDate = new Date(currentPost.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    return (
        <div className="group/content flex flex-col w-full bg-muted/50 rounded-2xl p-4 transition-all duration-200 hover:bg-muted/80">
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                    Featured Post
                </span>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handlePrev}>
                        <ArrowLeft className="h-3.5 w-3.5" />
                    </Button>
                    <span className="text-xs text-muted-foreground font-medium select-none px-1">
                        {currentIndex + 1}/{initialFeaturedBlogs.length}
                    </span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleNext}>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            <Link 
                href={`/insights/${currentPost._id}`}
                className="flex items-start justify-between gap-4 w-full text-inherit no-underline cursor-pointer group"
            >
                <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-1.5">
                            <span className="font-semibold text-foreground truncate max-w-[120px]">
                                {currentPost.authorName}
                            </span>
                            <span>•</span>
                            <span className="shrink-0">{formattedDate}</span>
                        </div>

                        <h3 className="text-sm md:text-base font-semibold leading-snug tracking-tight text-foreground transition-colors duration-200 group-hover:text-blue-600 line-clamp-3">
                            {currentPost.title}
                        </h3>
                    </div>
                </div>

                <div className="relative h-20 w-20 md:h-24 md:w-24 shrink-0 rounded-xl overflow-hidden bg-background">
                    {initialFeaturedBlogs.map((post, index) => (
                        <Image
                            key={post._id}
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            className={`object-cover transition-opacity duration-300 ${
                                index === currentIndex ? "opacity-100 block" : "opacity-0 hidden"
                            }`}
                            sizes="(max-width: 768px) 80px, 96px"
                            priority={index === 0} 
                        />
                    ))}
                </div>
            </Link>
        </div>
    );
}