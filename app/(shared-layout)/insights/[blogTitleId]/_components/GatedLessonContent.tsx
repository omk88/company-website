"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createLowlight } from "lowlight";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import "highlight.js/styles/github-dark.css";
import { visit } from "unist-util-visit";
import rehypeSlug from "rehype-slug";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Separator } from "@/components/ui/separator";
import { CodeBlock } from "./CodeBlock";
import { AudioPlayer } from "@/app/(shared-layout)/insights/[blogTitleId]/_components/AudioPlayer";
import { extractHeadings } from "@/app/(shared-layout)/insights/[blogTitleId]/_utils/extractHeadings";
import { TableOfContents } from "@/app/(shared-layout)/insights/[blogTitleId]/_components/TableOfContents";
import { BlogImage } from "@/components/web/BlogImage";
import {
  MarkdownTable,
  MarkdownTableBody,
  MarkdownTableCell,
  MarkdownTableHead,
  MarkdownTableHeader,
  MarkdownTableRow,
} from "@/app/(shared-layout)/insights/[blogTitleId]/_components/MarkdownTable";
import BlogVideoPlayer from "@/app/(shared-layout)/insights/[blogTitleId]/_components/BlogVideoPlayer";

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

function rehypeConditionalAutolink() {
  return (tree: any) => {
    visit(tree, "element", (node: any) => {
      if (/^h[1-6]$/.test(node.tagName) && node.properties?.id) {
        const hasLink = node.children.some((child: any) => child.tagName === "a");

        if (!hasLink) {
          node.children = [
            {
              type: "element",
              tagName: "a",
              properties: {
                href: `#${node.properties.id}`,
                className: [
                  "no-underline",
                  "text-inherit",
                  "hover:text-blue-600",
                  "dark:hover:text-blue-400",
                  "transition-colors",
                  "cursor-pointer",
                ],
              },
              children: node.children,
            },
          ];
        }
      }
    });
  };
}

interface GatedLessonContentProps {
  blogId: Id<"blogs">;
  title: string;
  isVideo?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  chapters?: Doc<"blogs">["chapters"];
  content?: string;
}

export function GatedLessonContent({
  blogId,
  title,
  isVideo,
  videoUrl,
  audioUrl,
  chapters,
  content,
}: GatedLessonContentProps) {
  const accessState = useQuery(api.blogs.getBlogAccessState, { blogId });

  const userCanAccessBlog = accessState?.userCanAccessBlog ?? Boolean(content);
  const isPartOfPaidCourse = accessState?.isPartOfPaidCourse ?? false;

  const headings = extractHeadings(userCanAccessBlog ? content : "");

  if (!userCanAccessBlog) {
    return (
      <section className="my-8 rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 text-center">
        <h2 className="text-xl font-semibold text-neutral-100">
          {isPartOfPaidCourse
            ? "This lesson is part of a paid course"
            : "This content is currently locked"}
        </h2>
        <p className="mt-2 text-sm text-neutral-400">
          Purchase the course to unlock the full lesson content and media.
        </p>
      </section>
    );
  }

  return (
    <>
      {isVideo && videoUrl && (
        <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden mb-6">
          <BlogVideoPlayer videoUrl={videoUrl} />
        </div>
      )}

      {audioUrl && (
        <div className="mb-4">
          <AudioPlayer audioUrl={audioUrl} title={title} chapters={chapters} />
        </div>
      )}

      <Separator className="mt-8" />

      <TableOfContents headings={headings} />

      {content && (
        <section className="prose prose-neutral dark:prose-invert max-w-none text-lg leading-relaxed w-full min-w-0 [&_p]:break-words">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMetaAsData]}
            rehypePlugins={[rehypeSlug, rehypeConditionalAutolink]}
            components={{
              pre: CodeBlock,
              table: MarkdownTable,
              thead: MarkdownTableHeader,
              tbody: MarkdownTableBody,
              tr: MarkdownTableRow,
              th: MarkdownTableHead,
              td: MarkdownTableCell,
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
              img({ src, alt, ...props }) {
                return <BlogImage src={src} alt={alt} {...props} />;
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </section>
      )}
    </>
  );
}