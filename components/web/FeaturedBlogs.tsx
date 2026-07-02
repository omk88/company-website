"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export function FeaturedBlogs() {
    const featuredBlogList = useQuery(api.blogs.getFeaturedPosts);
    const featuredBlogs = featuredBlogList ?? [];

    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? featuredBlogs.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === featuredBlogs.length - 1 ? 0 : prevIndex + 1
        );
    };

    useEffect(() => {
        if (featuredBlogs.length <= 1) return;
        const interval = setInterval(() => {
            handleNext();
        }, 10000);
        return () => clearInterval(interval);
    }, [featuredBlogs.length, currentIndex]);

    if (featuredBlogList === undefined) {
        return <div className="min-h-[220px] bg-muted animate-pulse" />; 
    }

    if (featuredBlogs.length === 0) {
        return <div className="p-4 text-muted-foreground">No featured posts found.</div>;
    }

    const currentPost = featuredBlogs[currentIndex];
    const formattedDate = new Date(currentPost.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    return (
        <div className="mt-2 w-full">
            <div className="relative aspect-video w-full overflow-hidden bg-muted border border-border/50 shrink-0">
                <Image
                    src={currentPost.imageUrl}
                    alt={currentPost.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    priority
                />
            </div>
            
            <div className="p-2">
                <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex justify-between">
                    <h1>{currentPost.author}</h1>
                    <h1>{formattedDate}</h1>
                </div>

                <div className="mt-2 flex flex-col">
                    
                    <div className="h-[28px] overflow-hidden">
                        <h3 className="break-all text-lg font-bold tracking-tight line-clamp-1 text-foreground transition-colors duration-200 group-hover:text-primary leading-tight">
                            {currentPost.title}
                        </h3>
                    </div>
                    
                    <div className="h-[60px] overflow-hidden">
                        <p className="break-all text-muted-foreground line-clamp-3 leading-relaxed text-sm -mt-0.5">
                            {currentPost.subtitle}
                        </p>
                    </div>
                    
                </div>
            </div>

            <div className="flex flex-row flex-1 justify-center items-center gap-2 mt-2 border-t pt-2 border-border/40">
                <Button variant="ghost" size="icon" onClick={handlePrev}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-center">
                    {currentIndex + 1}
                </h1>
                <Button variant="ghost" size="icon" onClick={handleNext}>
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}