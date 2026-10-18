import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
import { CodeBlock } from "../../../app/(shared-layout)/insights/[blogTitleId]/_components/CodeBlock";
import { AudioPlayer } from "@/app/(shared-layout)/insights/[blogTitleId]/_components/AudioPlayer";
import { extractHeadings } from "@/app/(shared-layout)/insights/[blogTitleId]/_utils/extractHeadings";
import { TableOfContents } from "@/app/(shared-layout)/insights/[blogTitleId]/_components/TableOfContents";
import rehypeSlug from "rehype-slug";
import { BlogImage } from "../BlogImage";
import { MarkdownTable, MarkdownTableBody, MarkdownTableCell, MarkdownTableHead, MarkdownTableHeader, MarkdownTableRow } from "@/app/(shared-layout)/insights/[blogTitleId]/_components/MarkdownTable";
import { BlogLastUpdated } from "@/app/(shared-layout)/insights/[blogTitleId]/_components/BlogLastUpdated";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { FaFacebook, FaXTwitter } from "react-icons/fa6";
import { RxLinkedinLogo } from "react-icons/rx";
import { ShareLinks } from "@/app/(shared-layout)/insights/[blogTitleId]/_components/ShareLinks";
import { BlogSeriesNavbar } from "@/app/(shared-layout)/insights/[blogTitleId]/_components/SeriesNavbarCard";

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

  const headings = extractHeadings(blog.content);

  return (
    <article className="p-2">
      <ViewTracker blogId={blog._id} />

      <div className="relative w-full h-[300px] md:h-[400px] mb-2 md:mb-6 rounded-lg overflow-hidden">
        <Image
          unoptimized
          src={blog.imageUrl}
          alt={blog.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1920px"
          className="object-cover"
        />
      </div>

      <header className="flex flex-col">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50">
          {blog.title}
        </h1>

        <div className="flex flex-col py-4 gap-1">
          <BlogName
            avatarSrc={avatarSrc}
            username={blog.username}
            displayName={blog.displayName}
            date={blog._creationTime}
            readTime={blog.readTime}
          />

          <BlogLastUpdated date={blog.updatedAt} />
        </div>

        <div className="mb-4">
          <BlogEmojiReactions initialBlog={blog} />
        </div>

        <div className="flex flex-col gap-4">
          <BlogSeriesNavbar blogId={blog._id} />
          <p className="text-lg text-neutral-600 dark:text-neutral-400 font-medium">
            {blog.subtitle}
          </p>
          <AudioPlayer audioUrl={blog.audioUrl} title={blog.title} chapters={blog.chapters} />
          <ShareLinks />
        </div>

      </header>

      <Separator className="mt-8" />

      <TableOfContents headings={headings} />

      <section className="prose prose-neutral dark:prose-invert max-w-none text-lg leading-relaxed w-full min-w-0 [&_p]:break-words">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMetaAsData]}
          rehypePlugins={[
            rehypeSlug,
            rehypeConditionalAutolink,
          ]}
          components={{
            pre: CodeBlock,
            table: MarkdownTable,
            thead: MarkdownTableHeader,
            tbody: MarkdownTableBody,
            tr: MarkdownTableRow,
            th: MarkdownTableHead,
            td: MarkdownTableCell,
            code({ node, className, children, ...props }: any) {
              const isInline =
                !node?.parent || node?.parent?.tagName !== "pre";

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