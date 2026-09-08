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

interface ExtendedBlog extends Doc<"blogs"> {
  imageUrl: string;
  profilePicUrl: string | null;
  defaultProfilePicUrl: string | null;
}

interface BlogContentProps {
  blog: ExtendedBlog;
  preloadedComments: Preloaded<typeof api.comments.getCommentsByBlog>;
}

export function BlogContent({ blog, preloadedComments }: BlogContentProps) {
  const authorName = blog.displayName || blog.username;
  const avatarSrc = blog.profilePicUrl || blog.defaultProfilePicUrl || "/noImage.png";

  return (
    <article className="p-2">
      <ViewTracker blogId={blog._id} />

      <div className="relative w-full h-[400px] mb-6 rounded-lg overflow-hidden">
        <Image
          src={blog.imageUrl}
          alt={blog.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
          className="object-cover"
        />
      </div>

      <header className="flex flex-col">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50">
          {blog.title}
        </h1>
        
        <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400 font-normal my-4">
          <div className="flex items-center gap-2">
            <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0">
              <Image
                src={avatarSrc}
                alt={`${authorName}'s avatar`}
                fill
                sizes="20px"
                className="object-cover"
              />
            </div>

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
      </header>

      <Separator className="my-8" />

      <section className="prose prose-neutral dark:prose-invert max-w-none text-lg leading-relaxed">
        <ReactMarkdown
          rehypePlugins={[[rehypeHighlight, { lowlight }]]}
          components={{ pre: CodeBlock }}
        >
          {blog.content}
        </ReactMarkdown>
      </section>

      <BlogCTA />
      <Separator className="my-10" />

      <section id="comments">
        <CommentSection preloadedComments={preloadedComments} />
      </section>
    </article>
  );
}