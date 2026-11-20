import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { BlogCTA } from "@/components/web/BlogCTA";
import { CommentSection } from "@/components/web/CommentSection";
import { ViewTracker } from "@/components/web/ViewTracker";
import { BlogEmojiReactions } from "@/components/web/BlogEmojiReactions";
import { Doc } from "@/convex/_generated/dataModel";
import { Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BlogName } from "./BlogName";
import { BlogLastUpdated } from "@/app/(shared-layout)/insights/[blogTitleId]/_components/BlogLastUpdated";
import { ShareLinks } from "@/app/(shared-layout)/insights/[blogTitleId]/_components/ShareLinks";
import { BlogSeriesNavbar } from "@/app/(shared-layout)/insights/[blogTitleId]/_components/SeriesNavbarCard";
import { RestrictedContent } from "@/app/(shared-layout)/insights/[blogTitleId]/_components/RestrictedContent";

interface ExtendedBlog extends Doc<"blogs"> {
  imageUrl: string;
  videoUrl?: string;
  profilePicUrl: string | null;
  defaultProfilePicUrl: string | null;
}

export type SeriesWithDetails = Doc<"series"> & {
  articleCount?: number;
  coverImageUrl?: string | null;
};

interface BlogContentProps {
  blog: ExtendedBlog;
  primarySeries: SeriesWithDetails | null;
  seriesArticleCount?: number;
  seriesCoverImageUrl?: string | null;
  preloadedComments: Preloaded<typeof api.comments.getCommentsByBlog>;
}

export function BlogContent({
  blog,
  primarySeries,
  seriesArticleCount,
  seriesCoverImageUrl,
  preloadedComments,
}: BlogContentProps) {
  const avatarSrc = blog.profilePicUrl || blog.defaultProfilePicUrl || "/noImage.png";
  const resolvedSeriesCount =
    seriesArticleCount ?? primarySeries?.articleCount ?? 0;
  const resolvedCoverImageUrl =
    seriesCoverImageUrl ?? primarySeries?.coverImageUrl ?? null;

  return (
    <article className="p-2">
      <ViewTracker blogId={blog._id} />

      {!blog.isVideo && (
        <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden">
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
      )}

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
            isVideo={blog.isVideo || false}
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

          <ShareLinks />

          <RestrictedContent
            blogId={blog._id}
            title={blog.title}
            isVideo={blog.isVideo}
            videoUrl={blog.videoUrl}
            audioUrl={blog.audioUrl}
            chapters={blog.chapters}
            content={blog.content}
            primarySeries={primarySeries}
            primarySeriesCount={resolvedSeriesCount}
            seriesCoverImageUrl={resolvedCoverImageUrl}
          />
        </div>
      </header>

      <BlogCTA />
      <Separator className="my-10" />

      <section id="comments">
        <CommentSection preloadedComments={preloadedComments} />
      </section>
    </article>
  );
}