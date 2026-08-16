"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, Eye, MessageSquare, Sparkles, ThumbsUp } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { ProfileHoverCard } from "./ProfileHoverCard";
import { FeaturedBlogsSkeleton } from "./LoadingSkeletons/FeaturedBlogsSkeleton";

function formatRelativeDate(dateString: string | number | Date): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "JUST NOW";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}M AGO`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}H AGO`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} ${diffInDays === 1 ? "DAY" : "DAYS"} AGO`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).toUpperCase();
}

export function FeaturedBlogs() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const featuredBlogs = useQuery(api.blogs.getFeaturedPosts);
  const blogs = featuredBlogs ?? [];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? blogs.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === blogs.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    if (blogs.length <= 1) return;
    const interval = setInterval(handleNext, 10000);
    return () => clearInterval(interval);
  }, [blogs.length]);

  if (featuredBlogs === undefined) {
    return <FeaturedBlogsSkeleton />;
  }

  if (blogs.length === 0) {
    return null;
  }

  const currentPost = blogs[currentIndex];
  const formattedDate = formatRelativeDate(currentPost.createdAt);

  const compactFormatter = new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  });

  return (
    <div className="flex flex-col justify-between w-full bg-zinc-50/80 dark:bg-zinc-900/50 rounded-xl p-3.5 transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>Featured</span>
        </div>
        <div className="flex items-center gap-0.5 text-zinc-500">
          <Button variant="ghost" size="icon" className="cursor-pointer h-5 w-5 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 rounded" onClick={handlePrev}>
            <ArrowLeft className="h-3 w-3" />
          </Button>
          <span className="text-[11px] font-mono select-none px-1 text-zinc-500">
            {currentIndex + 1}/{blogs.length}
          </span>
          <Button variant="ghost" size="icon" className="cursor-pointer h-5 w-5 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 rounded" onClick={handleNext}>
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <Link 
        href={`/insights/${currentPost._id}`}
        className="group/card flex items-start justify-between gap-3 w-full text-inherit no-underline cursor-pointer my-1"
      >
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div>
            <div className="font-roboto flex items-center gap-1.5 text-[11px] font-mono tracking-tight uppercase text-zinc-500 mb-1">
              <ProfileHoverCard authorUsername={currentPost.username} displayName={currentPost.displayName}>
                <span className="cursor-pointer truncate max-w-[90px]">{currentPost.displayName || currentPost.username}</span>
              </ProfileHoverCard>
              <span>•</span>
              <span className="shrink-0">{formattedDate}</span>
            </div>

            <h3 className="text-[13px] font-medium leading-snug text-zinc-900 dark:text-zinc-100 group-hover/card:text-blue-600 transition-colors line-clamp-2">
              {currentPost.title}
            </h3>
          </div>
        </div>

        <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          {blogs.map((post, index) => (
            <Image
              key={post._id}
              src={post.imageUrl}
              alt={post.title}
              fill
              className={`object-cover transition-opacity duration-100 ${
                index === currentIndex ? "opacity-100 block" : "opacity-0 hidden"
              }`}
              sizes="56px"
              priority={index === 0} 
            />
          ))}
        </div>
      </Link>

      <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-mono pt-1">
        <div className="flex items-center gap-1">
          <Eye className="w-3 h-3 stroke-[2] shrink-0" />
          <span>{compactFormatter.format(currentPost.totalViews)}</span>
        </div>
        <div className="flex items-center gap-1">
          <ThumbsUp className="w-3 h-3 stroke-[2] shrink-0" />
          <span>{compactFormatter.format(currentPost.likes)}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="w-3 h-3 stroke-[2] shrink-0" />
          <span>{compactFormatter.format(currentPost.commentCount)}</span>
        </div>
      </div>
    </div>
  );
}