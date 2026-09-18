"use client";

import { InteractionState } from "@/components/web/IncrementBlogLikesDislikes";
import { Doc } from "@/convex/_generated/dataModel";

import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/app/ConvexClientProvider";
import { useBlogStore } from "@/stores/useBlogStore";
import { Button } from "@/components/ui/button";
import { Bookmark, Copy, Ellipsis, MessageSquare, Share2, SmilePlus, SquarePen, Star, ThumbsUp, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EMOJI_REACTIONS, ReactionType } from "@/app/constants/reactions";
import { FaFacebook, FaXTwitter } from "react-icons/fa6";
import { RxLinkedinLogo } from "react-icons/rx";
import { DeleteBlogDialog } from "@/components/web/DeleteBlogDialog";
import Link from "next/link";
import { useState } from "react";

interface MobileControlsProps {
  blog: Doc<"blogs">;
  interactionState: InteractionState;
}

export function MobileControls({ blog, interactionState }: MobileControlsProps) {

  const router = useRouter();

  const currentUser = useCurrentUser();

  const liveState = useQuery(api.blogs.getBlogInteractionState, { blogId: blog._id });

  const voteState = liveState?.voteState ?? interactionState.voteState;
  const reactionState = liveState?.reactionState ?? interactionState.reactionState;
  const featuredState = liveState?.featuredState ?? interactionState.featuredState;
  const isBookmarked = liveState?.isBookmarked ?? interactionState.bookmarkState.isBookmarked;
  const displayComments = liveState?.commentCount ?? interactionState.displayComments;

  const isOwnBlog = liveState?.isOwnBlog ?? false;
  const userEmail = currentUser?.email;
  const isCompanyUser = Boolean(userEmail?.endsWith("@taqtiq.tech"));
  const canEditOrDelete = isCompanyUser || isOwnBlog;

  const hasLiked = voteState.hasVoted;
  const likesCount = voteState.likes;
  const isFeatured = featuredState.isFeatured;

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const toggleReactionMutation = useMutation(api.blogs.toggleBlogReaction).withOptimisticUpdate(
    (localStore, args) => {
      const { blogId, reactionType } = args;
      const previous = localStore.getQuery(api.blogs.getBlogInteractionState, { blogId });
      if (!previous) return;

      const userReactions = previous.reactionState?.userReactions ?? [];
      const counts = previous.reactionState?.counts ?? {
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
        api.blogs.getBlogInteractionState,
        { blogId },
        {
          ...previous,
          reactionState: {
            userReactions: nextUserReactions,
            counts: {
              ...counts,
              [reactionType]: nextCount,
            },
          },
        }
      );
    }
  );

  const toggleBlogVoteMutation = useMutation(api.blogs.toggleBlogVote).withOptimisticUpdate(
    (localStore, args) => {
      const { blogId } = args;
      const previous = localStore.getQuery(api.blogs.getBlogInteractionState, { blogId });
      if (!previous) return;

      const currentHasVoted = previous.voteState.hasVoted;
      const currentLikes = previous.voteState.likes;

      const nextHasVoted = !currentHasVoted;
      const nextLikes = nextHasVoted ? currentLikes + 1 : currentLikes - 1;

      localStore.setQuery(
        api.blogs.getBlogInteractionState,
        { blogId },
        {
          ...previous,
          voteState: {
            hasVoted: nextHasVoted,
            likes: nextLikes,
          },
        }
      );
    }
  );

  const toggleBookmark = useMutation(api.blogs.toggleBookmark).withOptimisticUpdate(
    (localStore, args) => {
      const { blogId } = args;
      const previous = localStore.getQuery(api.blogs.getBlogInteractionState, { blogId });
      if (!previous) return;

      localStore.setQuery(
        api.blogs.getBlogInteractionState,
        { blogId },
        {
          ...previous,
          isBookmarked: !previous.isBookmarked,
        }
      );
    }
  );

  const toggleFeaturedMutation = useMutation(api.blogs.toggleFeatured).withOptimisticUpdate(
    (localStore, args) => {
      const { blogId } = args;
      const previous = localStore.getQuery(api.blogs.getBlogInteractionState, { blogId });
      if (!previous) return;

      localStore.setQuery(
        api.blogs.getBlogInteractionState,
        { blogId },
        {
          ...previous,
          featuredState: {
            isFeatured: !previous.featuredState.isFeatured,
          },
        }
      );
    }
  );

  const totalReactions = Object.values(reactionState.counts).reduce((acc, count) => acc + count, 0);

  const handleLikeClick = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to like an article.", {
        action: {
          label: "Sign in",
          onClick: () => router.push("/sign-in"),
        },
      });
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
      toast.error("You must be logged in to bookmark an article.", {
        action: {
          label: "Sign in",
          onClick: () => router.push("/sign-in"),
        },
      });
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
      toast.error("You must be logged in to react to an article.", {
        action: {
          label: "Sign in",
          onClick: () => router.push("/sign-in"),
        },
      });
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
      toast.error("You must be logged in to feature an article.", {
        action: {
          label: "Sign in",
          onClick: () => router.push("/sign-in"),
        },
      });
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

  const setSelectedBlog = useBlogStore((state) => state.setSelectedBlog);

    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-center justify-center h-16 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4">
        <div className="w-fit flex">
            <div className="flex flex-row gap-2">
                <Button
                    variant="ghost"
                    onClick={handleLikeClick}
                    className="flex flex-row items-center justify-center gap-1 h-14 w-14 p-0 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                    <ThumbsUp
                        className={`size-6 shrink-0 transition-none ${
                            hasLiked ? "text-emerald-500 fill-emerald-500" : ""
                        }`}
                    />
                    <span className={`text-lg font-medium leading-none ${hasLiked ? "text-emerald-500 font-bold" : ""}`}>
                        {likesCount}
                    </span>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex flex-row items-center justify-center gap-1 h-14 w-14 p-0 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                            <SmilePlus className="size-6 shrink-0" />
                            <span className="text-lg font-medium leading-none">{totalReactions}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        side="top"
                        align="center"
                        sideOffset={12}
                        className="flex flex-row items-center gap-2 p-2 w-max min-w-0 z-50 rounded-full"
                    >
                        {EMOJI_REACTIONS.map(({ type, emoji, label }) => {
                        const isSelected = reactionState.userReactions.includes(type);
            
                        return (
                            <DropdownMenuItem
                                key={type}
                                onClick={() => handleSelectReaction(type)}
                                className={`flex size-12 shrink-0 justify-center items-center rounded-full cursor-pointer text-xl p-0 ${
                                    isSelected
                                    ? "bg-zinc-100 dark:bg-zinc-800 scale-105"
                                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                }`}
                                    title={label}
                                >
                                <span role="img" aria-label={label} className="text-3xl flex items-center justify-center leading-none">
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
                    className="flex flex-row items-center justify-center gap-1 h-14 w-14 p-0 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                    <MessageSquare className="size-6 shrink-0" />
                    <span className="text-lg font-medium leading-none">{displayComments}</span>
                </Button>

                <Button
                    variant="ghost"
                    onClick={handleBookmarkClick}
                    className="flex items-center justify-center h-14 w-14 p-0 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                    <Bookmark
                        className={`size-6 ${
                        isBookmarked
                            ? "text-blue-500 fill-blue-500 dark:text-blue-300 dark:fill-blue-300"
                            : ""
                        }`}
                    />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex items-center justify-center h-14 w-14 p-0 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                            <Share2 className="size-6" />
                        </Button>
                    </DropdownMenuTrigger>
        
                    <DropdownMenuContent side="top" className="w-44 rounded-xl">
                        <DropdownMenuLabel className="text-lg font-semibold text-zinc-500">Share</DropdownMenuLabel>
            
                        <DropdownMenuItem
                            className="cursor-pointer text-xs flex items-center gap-2"
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                toast.success("Link copied to clipboard!");
                            }}
                        >
                            <Copy className="size-4.5 shrink-0" />
                            <span className="text-lg">Copy link</span>
                        </DropdownMenuItem>
            
                        <DropdownMenuItem
                            className="cursor-pointer text-lg flex items-center gap-2"
                            onClick={() => {
                                const shareUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(
                                window.location.href
                                )}&text=${encodeURIComponent("Check out this article!")}`;
                                window.open(shareUrl, "_blank", "noopener,noreferrer");
                            }}
                        >
                            <FaXTwitter className="size-4.5 shrink-0" />
                            <span className="text-lg">X (Twitter)</span>
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
                            <RxLinkedinLogo className="size-4.5 shrink-0" />
                            <span className="text-lg">LinkedIn</span>
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
                            <FaFacebook className="size-4.5 shrink-0" />
                            <span className="text-lg">Facebook</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex items-center justify-center h-14 w-14 p-0 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                            <Ellipsis className="size-6 " />
                        </Button>
                    </DropdownMenuTrigger>
        
                    <DropdownMenuContent side="top" className="w-44 rounded-xl">
                        <DropdownMenuLabel className="text-lg font-semibold text-zinc-500">Manage</DropdownMenuLabel>

                        <DropdownMenuItem
                            className={`cursor-pointer text-xs flex items-center gap-2`}
                            onClick={handleFeaturedClick}
                        >
                            <Star
                                className={`size-4.5 ${
                                    isFeatured ? "text-amber-500 fill-amber-500" : ""
                                }`}
                            />
                            <span className="text-lg">
                                {isFeatured ? "Unfeature Blog" : "Feature Blog"}
                            </span>
                        </DropdownMenuItem>
            
                        <DropdownMenuItem
                            onClick={() => setSelectedBlog(blog)}
                        >
                            <Link href={`/create-blog?id=${blog._id}`} className="text-lg flex items-center gap-2">
                                <SquarePen className="size-4.5 shrink-0" />
                                <span className="text-lg">Edit Blog</span>
                            </Link>
                        </DropdownMenuItem>
            
                        <DropdownMenuItem 
                            onSelect={(e) => {
                                e.preventDefault();
                                setShowDeleteDialog(true);
                            }}
                        >
                            <Trash2 className="size-4.5 shrink-0 mr-2" />
                            <span className="text-lg">Delete Blog</span>
                        </DropdownMenuItem>

                        <DeleteBlogDialog
                            open={showDeleteDialog}
                            onOpenChange={setShowDeleteDialog}
                            blogIds={[blog._id]}
                            onSuccess={() => { router.push("/insights"); }}
                        />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
      </div>
    )
}