"use client";

import Link from "next/link"; 
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { SidebarGroupLabel } from "../ui/sidebar";
import { Eye, Library, MessageSquare, ThumbsUp } from "lucide-react";
import { ProfileHoverCard } from "./ProfileHoverCard";
import { MoreFromSkeleton } from "./LoadingSkeletons/MoreFromAuthorSkeleton";

interface MoreFromClientProps {
  displayName?: string;
  username: string;
  author: string;
}

const compactFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 1,
});

export function MoreFromAuthor({ displayName, username, author }: MoreFromClientProps) {
  const blogs = useQuery(api.blogs.getPostsByAuthor, { author: author });

  if (blogs === undefined) {
    return <MoreFromSkeleton count={3} displayName={displayName} username={username} />;
  }

  if (blogs.length === 0) {
    return null;
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
        {blogs.map((blog) => (
          <li key={blog._id} className="w-full block">
            <Link 
              href={`/insights/${blog._id}`} 
              className="group/trending block w-full text-inherit no-underline cursor-pointer p-3 rounded-2xl bg-muted transition-all duration-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
            >
              <div className="w-full flex flex-row items-center justify-between gap-3">
                <div className="w-full flex flex-col gap-1">
                  <div className="overflow-hidden">
                    <h3 className="break-words text-[13px] font-semibold tracking-tight line-clamp-1 text-foreground/90 transition-colors duration-150 group-hover/trending:text-blue-600 leading-snug">
                      {blog.title}
                    </h3>
                  </div>
                  
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