import Image from "next/image";
import ReactMarkdown from "react-markdown";

import { Separator } from "@/components/ui/separator";
import { BlogCTA } from "@/components/web/BlogCTA";
import { CommentSection } from "@/components/web/CommentSection";
import { ViewTracker } from "@/components/web/ViewTracker";
import { BlogEmojiReactions } from "@/components/web/BlogEmojiReactions";
import { Doc } from "@/convex/_generated/dataModel";
import { Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BlogName } from "./BlogName";

import { CodeBlock } from "../CodeBlock";
import rehypeHighlight from "rehype-highlight";
import { createLowlight } from "lowlight";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import "highlight.js/styles/github-dark.css";

const lowlight = createLowlight();
lowlight.register("javascript", js);
lowlight.register("js", js);
lowlight.register("typescript", ts);
lowlight.register("ts", ts);

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

            <BlogName username={blog.username} displayName={blog.displayName} />

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
        <ReactMarkdown
          rehypePlugins={[[rehypeHighlight, { lowlight }]]}
          components={{ pre: CodeBlock }}
        >
          {blog.content}
        </ReactMarkdown>
      </div>

      <BlogCTA />
      <Separator className="my-10" />

      <div id="comments">
        <CommentSection preloadedComments={preloadedComments} />
      </div>
    </div>
  );
}