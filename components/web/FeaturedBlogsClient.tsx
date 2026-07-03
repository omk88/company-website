"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useEffect, MouseEvent } from "react";
import Link from "next/link";
import { BlogPostPreview } from "./BlogCard";

interface FeaturedBlogsClientProps {
    initialFeaturedBlogs: BlogPostPreview[];
}

export function FeaturedBlogsClient({ initialFeaturedBlogs }: FeaturedBlogsClientProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = (e: MouseEvent<HTMLButtonElement>) => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? initialFeaturedBlogs.length - 1 : prevIndex - 1
        );
    };

    const handleNext = (e: MouseEvent<HTMLButtonElement> | { preventDefault: () => void }) => {
        setCurrentIndex((prevIndex) => 
            prevIndex === initialFeaturedBlogs.length - 1 ? 0 : prevIndex + 1
        );
    };

    useEffect(() => {
        if (initialFeaturedBlogs.length <= 1) return;
        const interval = setInterval(() => {
            handleNext({ preventDefault: () => {} });
        }, 10000);
        return () => clearInterval(interval);
    }, [initialFeaturedBlogs.length, currentIndex]);

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
        <div className="flex flex-col gap-0 w-full text-inherit overflow-hidden">
            <Link 
                href={`/insights/${currentPost._id}`}
                className="group/content flex flex-col w-full text-inherit no-underline cursor-pointer"
            >
                <div className="w-full">
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
                </div>
                
                <div className="pt-2 px-0.5">
                    <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex justify-between">
                        <h1>{currentPost.author}</h1>
                        <h1>{formattedDate}</h1>
                    </div>

                    <div className="mt-2 h-[3.25rem] flex flex-col justify-start overflow-hidden">
                        <h3 className="break-words text-lg font-bold tracking-tight text-foreground transition-colors duration-200 group-hover/content:text-blue-600 leading-snug line-clamp-2">
                            {currentPost.title}
                        </h3>
                    </div>
                </div>
            </Link>

            <div className="flex flex-row justify-center items-center gap-2 pt-3 pb-2 border-border/40">
                <Button variant="ghost" size="icon" onClick={handlePrev}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-center min-w-[16px] text-muted-foreground font-medium text-sm select-none">
                    {currentIndex + 1}
                </h1>
                <Button variant="ghost" size="icon" onClick={handleNext}>
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}