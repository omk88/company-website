import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

import { Separator } from "@/components/ui/separator";
import { BlogCTA } from "@/components/web/BlogCTA";
import { CommentSection } from "@/components/web/CommentSection";
import { ViewTracker } from "@/components/web/ViewTracker";
import { BlogEmojiReactions } from "@/components/web/BlogEmojiReactions";
import { ProfileHoverCard } from "@/components/web/ProfileHoverCard";
import { Doc } from "@/convex/_generated/dataModel";
import { Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";

interface BlogContentProps {
    blog: Doc<"blogs">;
    preloadedComments: Preloaded<typeof api.comments.getCommentsByBlog>;
}

export function BlogContent({ blog, preloadedComments }: BlogContentProps) {
  return (
    <div className="p-2">
      <ViewTracker blogId={blog._id} />

      <div className="relative w-full h-[400px] mb-6 rounded-lg overflow-hidden">
        <Image
          src={blog.imageUrl}
          alt={blog.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="flex flex-col">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50">
          {blog.title}
        </h1>
        
        <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400 font-normal my-4">
          <div className="flex items-center gap-2">
            <img
              src={blog.authorAvatarUrl}
              alt={blog.displayName || blog.username}
              className="w-5 h-5 rounded-full object-cover shrink-0"
            />

            <ProfileHoverCard authorUsername={blog.username} displayName={blog.displayName}>
              <Link
                href={`/${blog.username}`}
                className="font-medium hover:underline cursor-pointer"
              >
                {blog.displayName || blog.username}
              </Link>
            </ProfileHoverCard>

            <span>&middot;</span>

            <time dateTime={new Date(blog._creationTime).toISOString()}>
              {new Date(blog._creationTime).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>

          <span className="text-xs sm:text-sm text-zinc-500 font-medium">
            {blog.readTime} min read
          </span>
        </div>

        <div className="mb-4">
          <BlogEmojiReactions initialBlog={blog} />
        </div>

        <p className="text-lg text-neutral-600 dark:text-neutral-400 font-medium">
          {blog.subtitle}
        </p>
      </div>

      <Separator className="my-8" />

      <div className="prose prose-neutral dark:prose-invert max-w-none text-lg leading-relaxed">
        <ReactMarkdown>{blog.content}</ReactMarkdown>
      </div>

      <Separator className="my-10" />
      <BlogCTA />
      <Separator className="my-10" />

      <div id="comments">
        <CommentSection preloadedComments={preloadedComments} />
      </div>
    </div>
  );
}