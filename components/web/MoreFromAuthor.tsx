"use client";

import Link from "next/link"; 
import Image from "next/image";
import { Eye, Library, MessageSquare, ThumbsUp } from "lucide-react";
import { ProfileHoverCard } from "./ProfileHoverCard";

interface AuthorPost {
  _id: string;
  title: string;
  imageUrl: string;
  totalViews: number;
  likes: number;
  commentCount: number;
}

interface MoreFromAuthorProps {
  displayName?: string;
  username: string;
  blogs: AuthorPost[];
}

const compactFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 1,
});

export function MoreFromAuthor({ displayName, username, blogs }: MoreFromAuthorProps) {
  if (!blogs || blogs.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col pt-2">
      <div className="flex items-center gap-1.5 px-3.5 mb-2.5 text-zinc-800 dark:text-zinc-200 font-semibold text-xs tracking-tight">
        <Library className="w-3.5 h-3.5 shrink-0" />
        <span className="shrink-0">
          More from{" "}
          <ProfileHoverCard authorUsername={username} displayName={displayName}>
            <span className="cursor-pointer truncate max-w-[120px] inline-block align-bottom">
              {displayName || username}
            </span>
          </ProfileHoverCard>
        </span>
      </div>

      <ul className="list-none w-full m-0 p-0 space-y-2">
        {blogs.map((blog) => (
          <li key={blog._id} className="w-full block">
            <Link 
              href={`/insights/${blog._id}`} 
              className="group/author block w-full p-3 rounded-xl bg-zinc-50/80 hover:bg-zinc-100/90 dark:bg-zinc-900/50 dark:hover:bg-zinc-800/80 transition-all duration-100"
            >
              <div className="w-full flex flex-row items-center justify-between gap-3">
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                  <h3 className="text-[13px] font-medium leading-snug text-zinc-800 dark:text-zinc-200 group-hover/author:text-zinc-950 dark:group-hover/author:text-white line-clamp-1 transition-colors">
                    {blog.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-mono pt-1">
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

                <div className="relative w-11 h-11 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
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