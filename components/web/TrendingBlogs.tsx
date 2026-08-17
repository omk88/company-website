"use client";

import Link from "next/link"; 
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Eye, MessageSquare, ThumbsUp, TrendingUp } from "lucide-react";
import { TrendingBlogsSkeleton } from "./LoadingSkeletons/TrendingBlogsSkeleton";

const compactFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 1,
});

export function TrendingBlogs() {
  const trendingBlogs = useQuery(api.blogs.getTrendingPosts);

  if (trendingBlogs === undefined) {
    return <TrendingBlogsSkeleton count={3} />;
  }

  if (trendingBlogs.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col pt-2">
      <div className="flex items-center gap-1.5 px-3.5 mb-2.5 text-zinc-800 dark:text-zinc-200 font-semibold text-xs tracking-tight">
        <TrendingUp className="w-3.5 h-3.5 shrink-0" />
        <span>Trending</span>
      </div>
      
      <ul className="list-none w-full m-0 p-0 space-y-2">
        {trendingBlogs.map((blog) => (
          <li key={blog._id} className="w-full block">
            <Link 
              href={`/insights/${blog._id}`} 
              className="group/trending block w-full p-3 rounded-xl bg-zinc-50/80 hover:bg-zinc-100/90 transition-all duration-100"
            >
              <div className="w-full flex flex-row items-center justify-between gap-3">
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                  <h3 className="text-[13px] font-medium leading-snug text-zinc-800 group-hover/trending:text-blue-600 line-clamp-2 transition-colors">
                    {blog.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-sans pt-1">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3 stroke-[2] shrink-0" />
                      <span>{compactFormatter.format(blog.totalViews)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3 stroke-[2] shrink-0" />
                      <span>{compactFormatter.format(blog.likes)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 stroke-[2] shrink-0" />
                      <span>{compactFormatter.format(blog.commentCount)}</span>
                    </div>
                  </div>
                </div>

                <div className="relative w-11 h-11 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                  <Image
                    src={blog.imageUrl}
                    alt={blog.title}
                    fill
                    sizes="44px"
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