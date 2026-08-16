"use client";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useConvex, useMutation, useQuery } from "convex/react";
import { Bookmark, Copy, Ellipsis, MessageSquare, SmilePlus, SquarePen, Star, ThumbsUp, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RxLinkedinLogo } from "react-icons/rx";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DeleteBlogDialog } from "./DeleteBlogDialog";
import { EMOJI_REACTIONS, ReactionType } from "@/app/constants/reactions";

interface IncrementBlogLikesProps {
  blog: Doc<"blogs">;
}

export function IncrementBlogLikesDislikes({ blog }: IncrementBlogLikesProps) {
  const convex = useConvex();
  const router = useRouter();

  const currentUser = useQuery(api.auth.getCurrentUser);
  const voteState = useQuery(api.blogs.getBlogVoteState, { blogId: blog._id });
  const reactionState = useQuery(api.blogs.getBlogReactionState, { blogId: blog._id });
  const displayComments = useQuery(api.comments.getCommentNumber, { blogId: blog._id }) ?? 0;
  const featuredState = useQuery(api.blogs.getBlogFeaturedState, { blogId: blog._id });
  const bookmarkState = useQuery(api.blogs.getBookmarkedState, { blogId: blog._id });

  const userEmail = currentUser?.email;
  const isCompanyUser = userEmail?.endsWith("@taqtiq.tech");

  const hasLiked = voteState?.hasVoted;
  const likesCount = voteState?.likes ?? blog.likes;
  const isFeatured = featuredState?.isFeatured;
  const isBookmarked = bookmarkState?.isBookmarked ?? false;

  const prefetchBlog = () => {
    convex.query(api.blogs.getBlogById, { blogId: blog._id }).catch((err) => {
      console.error("Prefetch failed:", err);
    });
  };


  const toggleReactionMutation = useMutation(api.blogs.toggleBlogReaction).withOptimisticUpdate(
    (localStore, args) => {
      const { blogId, reactionType } = args;
      const previous = localStore.getQuery(api.blogs.getBlogReactionState, { blogId });
      if (!previous) return;

      const userReactions = previous.userReactions ?? [];
      const counts = previous.counts ?? {
        heart: 0,
        insightful: 0,
        mindblown: 0,
        fire: 0,
        thinking: 0,
      };

      const hasReacted = userReactions.includes(reactionType);

      const nextUserReactions = hasReacted
        ? userReactions.filter((t) => t !== reactionType)
        : [...userReactions, reactionType];

      const currentCount = counts[reactionType as keyof typeof counts] ?? 0;
      const nextCount = hasReacted ? Math.max(0, currentCount - 1) : currentCount + 1;

      localStore.setQuery(
        api.blogs.getBlogReactionState,
        { blogId },
        {
          userReactions: nextUserReactions,
          counts: {
            ...counts,
            [reactionType]: nextCount,
          },
        }
      );
    }
  );

  const toggleBlogVoteMutation = useMutation(api.blogs.toggleBlogVote).withOptimisticUpdate(
    (localStore, args) => {
      const { blogId } = args;
      const previous = localStore.getQuery(api.blogs.getBlogVoteState, { blogId });

      const currentHasVoted = previous?.hasVoted ?? false;
      const currentLikes = previous?.likes ?? blog.likes;

      const nextHasVoted = !currentHasVoted;
      const nextLikes = nextHasVoted ? currentLikes + 1 : currentLikes - 1;

      localStore.setQuery(
        api.blogs.getBlogVoteState,
        { blogId },
        {
          hasVoted: nextHasVoted,
          likes: nextLikes,
        }
      );
    }
  );

  const toggleBookmark = useMutation(
    api.blogs.toggleBookmark
  ).withOptimisticUpdate((localStore, args) => {
    const previous = localStore.getQuery(api.blogs.getBookmarkedState, {
      blogId: args.blogId,
    });

    const currentIsBookmarked = previous?.isBookmarked ?? false;

    localStore.setQuery(
      api.blogs.getBookmarkedState,
      { blogId: args.blogId },
      { isBookmarked: !currentIsBookmarked }
    );
  });

  const toggleFeaturedMutation = useMutation(api.blogs.toggleFeatured).withOptimisticUpdate(
    (localStore, args) => {
      const { blogId } = args;
      const previous = localStore.getQuery(api.blogs.getBlogFeaturedState, { blogId });

      const currentIsFeatured = previous?.isFeatured ?? false;
      const nextHasVoted = !currentIsFeatured;

      localStore.setQuery(
        api.blogs.getBlogFeaturedState,
        { blogId },
        {
          isFeatured: nextHasVoted,
        }
      );
    }
  );

  const totalReactions = reactionState
    ? Object.values(reactionState.counts).reduce((acc, count) => acc + count, 0)
    : 0;

  const handleLikeClick = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to like an article.");
      return;
    }

    try {
      await toggleBlogVoteMutation({ blogId: blog._id });
    } catch (error) {
      console.error("Failed to process like:", error);
      toast.error("Failed to update your like.");
    }
  };

  const handleBookmarkClick = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to bookmark an article.");
      return;
    }

    try {
      await toggleBookmark({ blogId: blog._id });
    } catch (error) {
      console.error("Failed to update bookmark:", error);
      toast.error("Failed to update bookmark.");
    }
  };

  const handleSelectReaction = async (type: ReactionType) => {
    if (!currentUser) {
      toast.error("You must be logged in to react.");
      return;
    }

    try {
      await toggleReactionMutation({
        blogId: blog._id,
        reactionType: type,
      });
    } catch (error) {
      console.error("Failed to toggle reaction:", error);
      toast.error("Failed to update reaction.");
    }
  };

  const handleFeaturedClick = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to feature an article.");
      return;
    }

    try {
      await toggleFeaturedMutation({ blogId: blog._id });

      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag: "featured-blogs" }),
      });
    } catch (error) {
      console.error("Failed to process featured:", error);
      toast.error("Failed to update your feature.");
    }
  };

  const scrollToView = () => {
    document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col items-center gap-2 py-2 text-zinc-500">
      <Button
        variant="ghost"
        onClick={handleLikeClick}
        className="flex flex-row items-center justify-center gap-1 h-11 w-11 p-0 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
      >
        <ThumbsUp
          className={`w-4 h-4 shrink-0 transition-none ${
            hasLiked ? "text-emerald-500 fill-emerald-500" : ""
          }`}
        />
        <span className={`text-xs font-medium leading-none ${hasLiked ? "text-emerald-500 font-bold" : ""}`}>
          {likesCount}
        </span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex flex-row items-center justify-center gap-1 h-11 w-11 p-0 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <SmilePlus className="w-4 h-4 shrink-0" />
            <span className="text-xs font-medium leading-none">{totalReactions}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          align="center"
          sideOffset={12}
          className="flex flex-row items-center gap-2 p-2 w-max min-w-0 z-50 rounded-full"
        >
          {EMOJI_REACTIONS.map(({ type, emoji, label }) => {
            const isSelected = reactionState?.userReactions.includes(type);

            return (
              <DropdownMenuItem
                key={type}
                onClick={() => handleSelectReaction(type)}
                className={`flex h-8 w-8 shrink-0 justify-center items-center rounded-full cursor-pointer text-xl p-0 transition-transform hover:scale-110 focus:outline-none ${
                  isSelected
                    ? "bg-zinc-100 dark:bg-zinc-800 scale-105"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
                title={label}
              >
                <span role="img" aria-label={label} className="flex items-center justify-center leading-none">
                  {emoji}
                </span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        onClick={scrollToView}
        className="flex flex-row items-center justify-center gap-1 h-11 w-11 p-0 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
      >
        <MessageSquare className="w-4 h-4 shrink-0" />
        <span className="text-xs font-medium leading-none">{displayComments}</span>
      </Button>

      <Button
        variant="ghost"
        onClick={handleBookmarkClick}
        className="flex items-center justify-center h-11 w-11 p-0 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
      >
        <Bookmark
          className={`w-4 h-4 ${
            isBookmarked
              ? "text-blue-800 fill-blue-800 dark:text-blue-500 dark:fill-blue-500"
              : ""
          }`}
        />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center justify-center h-11 w-11 p-0 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <Ellipsis className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="right" className="w-44 rounded-xl">
          <DropdownMenuLabel className="text-xs font-semibold text-zinc-500">Share</DropdownMenuLabel>

          <DropdownMenuItem
            className="cursor-pointer text-xs flex items-center gap-2"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied to clipboard!");
            }}
          >
            <Copy className="h-3.5 w-3.5 shrink-0" />
            <span>Copy link</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer text-xs flex items-center gap-2"
            onClick={() => {
              const shareUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(
                window.location.href
              )}&text=${encodeURIComponent("Check out this article!")}`;
              window.open(shareUrl, "_blank", "noopener,noreferrer");
            }}
          >
            <FaXTwitter className="h-3.5 w-3.5 shrink-0" />
            <span>X (Twitter)</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer text-xs flex items-center gap-2"
            onClick={() => {
              const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                window.location.href
              )}`;
              window.open(shareUrl, "_blank", "noopener,noreferrer");
            }}
          >
            <RxLinkedinLogo className="h-3.5 w-3.5 shrink-0" />
            <span>LinkedIn</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer text-xs flex items-center gap-2"
            onClick={() => {
              const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                window.location.href
              )}`;
              window.open(shareUrl, "_blank", "noopener,noreferrer");
            }}
          >
            <FaFacebook className="h-3.5 w-3.5 shrink-0" />
            <span>Facebook</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Company Admin Tools */}
      {isCompanyUser && (
        <>
          <div className="w-8 h-[1px] bg-zinc-200 dark:bg-zinc-800 my-1" />

          <Button
            variant="ghost"
            onClick={handleFeaturedClick}
            className="flex items-center justify-center h-11 w-11 p-0 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <Star
              className={`w-4 h-4 ${
                isFeatured ? "text-amber-500 fill-amber-500" : ""
              }`}
            />
          </Button>

          <Button
            variant="ghost"
            className="flex items-center justify-center h-11 w-11 p-0 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            asChild
          >
            <Link href={`/company/blog?id=${blog._id}`} onMouseEnter={prefetchBlog}>
              <SquarePen className="w-4 h-4" />
            </Link>
          </Button>

          <DeleteBlogDialog
            blogIds={[blog._id]}
            onSuccess={() => {
              router.push("/insights");
            }}
            trigger={
              <Button
                variant="ghost"
                className="flex items-center justify-center h-11 w-11 p-0 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            }
          />
        </>
      )}
    </div>
  );
}