import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { createLowlight } from "lowlight";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import "highlight.js/styles/github-dark.css";
import { visit } from "unist-util-visit";

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
import { AudioPlayer } from "@/app/(shared-layout)/insights/[blogId]/_components/AudioPlayer";

const lowlight = createLowlight();
lowlight.register("javascript", js);
lowlight.register("js", js);
lowlight.register("typescript", ts);
lowlight.register("ts", ts);

function remarkMetaAsData() {
  return (tree: any) => {
    visit(tree, "code", (node: any) => {
      if (node.meta) {
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties["data-meta"] = node.meta;
      }
    });
  };
}

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
  const avatarSrc = blog.profilePicUrl || blog.defaultProfilePicUrl || "/noImage.png";

  return (
    <article className="p-2">
      <ViewTracker blogId={blog._id} />

      <div className="relative w-full h-[300px] md:h-[400px] mb-2 md:mb-6 rounded-lg overflow-hidden">
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

        <BlogName
          avatarSrc={avatarSrc}
          username={blog.username}
          displayName={blog.displayName}
          date={blog._creationTime}
          readTime={blog.readTime}
        />

        <div className="mb-4">
          <BlogEmojiReactions initialBlog={blog} />
        </div>

        <p className="mb-4 text-lg text-neutral-600 dark:text-neutral-400 font-medium">
          {blog.subtitle}
        </p>

        <AudioPlayer audioUrl={blog.audioUrl} title={blog.title} />
      </header>

      <Separator className="my-8" />

      <section className="prose prose-neutral dark:prose-invert max-w-none text-lg leading-relaxed">
        <ReactMarkdown
          rehypePlugins={[[rehypeHighlight, { lowlight }]]}
          components={{
            pre: CodeBlock,
            code({ node, className, children, ...props }: any) {
              const isInline = !node?.parent || node?.parent?.tagName !== "pre";

              if (isInline) {
                return (
                  <code
                    className="px-1.5 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-200 font-mono text-sm font-normal before:content-none after:content-none"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }

              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
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