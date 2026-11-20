"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createLowlight } from "lowlight";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import "highlight.js/styles/github-dark.css";
import { visit } from "unist-util-visit";
import rehypeSlug from "rehype-slug";

import { Preloaded, useQuery } from "convex/react";
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
import { Badge } from "@/components/ui/badge";
import { Library } from "lucide-react";
import Image from "next/image";
import { getCurrencySymbol } from "@/app/(shared-layout)/[username]/_components/LeftSidebarArticleSeries";
import PurchaseCourseButton from "./PurchaseCourseButton";
import { BlogCTA } from "@/components/web/BlogCTA";
import { CommentSection } from "@/components/web/CommentSection";

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

type SeriesWithDetails = Doc<"series"> & {
  articleCount?: number;
  coverImageUrl?: string | null;
};

interface RestrictedContentProps {
  blogId: Id<"blogs">;
  title: string;
  isVideo?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  chapters?: Doc<"blogs">["chapters"];
  content?: string;
  primarySeries: SeriesWithDetails | null;
  primarySeriesCount?: number;
  seriesCoverImageUrl?: string | null;
  preloadedComments: Preloaded<typeof api.comments.getCommentsByBlog>;
}

export function RestrictedContent({
  blogId,
  title,
  isVideo,
  videoUrl,
  audioUrl,
  chapters,
  content,
  primarySeries,
  primarySeriesCount,
  seriesCoverImageUrl,
  preloadedComments,
}: RestrictedContentProps) {
  const accessState = useQuery(api.blogs.getBlogAccessState, { blogId });
  const series = useQuery(api.series.getSeriesForBlog, { blogId });

  const userCanAccessBlog = accessState?.userCanAccessBlog ?? Boolean(content);
  const articleCount =
    primarySeriesCount ?? primarySeries?.articleCount ?? 0;
  const coverImageSrc =
    seriesCoverImageUrl ?? primarySeries?.coverImageUrl ?? "/noImage.png";

  const headings = extractHeadings(userCanAccessBlog ? content : "");

  if (!userCanAccessBlog) {
    return (
      <section className="my-10 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-2xl backdrop-blur-sm">
        <div className="border-b border-neutral-800/80 bg-neutral-900/90 px-6 py-6 text-center sm:px-8">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10 text-green-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h2 className="text-lg font-semibold tracking-tight text-neutral-100 sm:text-xl">
            This article is part of a paid series
          </h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-neutral-400">
            Purchase the full course to unlock this article.
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <div className="group flex flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950/70 transition-colors hover:border-neutral-700 sm:flex-row">
            <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-neutral-900 sm:aspect-auto sm:w-56 md:w-64">
              <Image
                unoptimized
                src={coverImageSrc}
                alt={primarySeries?.title || "Course cover"}
                fill
                className="object-cover"
                sizes="300px"
              />
            </div>

            <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
              <div>
                <div className="ml-auto flex flex-row gap-1.5">
                  <div className="flex items-center">
                    <Badge variant={"outline"} className="gap-1.5 py-1 px-2.5 text-neutral-400">
                      <Library className="w-3.5 h-3.5" />
                      <span>
                        {articleCount} {articleCount === 1 ? "Article" : "Articles"}
                      </span>
                    </Badge>
                  </div>
                </div>

                <h3 className="mt-2 text-lg font-bold text-neutral-100">
                  {primarySeries?.title}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-400">
                  {primarySeries?.description}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-800/80 pt-4">
                <div className="text-sm text-neutral-400">
                  Full Lifetime Access:{" "}
                  <span className="text-base font-semibold text-green-600 dark:text-green-300">
                    <span>{getCurrencySymbol(primarySeries?.currency || "")}{primarySeries?.price}</span>
                  </span>
                </div>

                <PurchaseCourseButton seriesId={primarySeries?._id}  />
              </div>
            </div>
          </div>
        </div>
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

          <BlogCTA />
          <Separator className="my-10" />

          <section id="comments">
            <CommentSection preloadedComments={preloadedComments} />
          </section>
        </section>
      )}
    </>
  );
}