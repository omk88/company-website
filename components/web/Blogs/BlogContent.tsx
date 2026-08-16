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

      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50">
          {blog.title}
        </h1>
        
        <div className="text-muted-foreground font-light text-sm">
          <ProfileHoverCard authorUsername={blog.username} displayName={blog.displayName}>
            <Link href={`/${blog.username}`} className="cursor-pointer hover:underline">
              {blog.displayName || blog.username}
            </Link>
          </ProfileHoverCard>
          <span>
            {" • "}
            {new Date(blog._creationTime).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <BlogEmojiReactions initialBlog={blog} />

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