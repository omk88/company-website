"use client";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useConvex, useMutation, usePreloadedQuery } from "convex/react";
import { usePreloadedAuthQuery } from "@convex-dev/better-auth/nextjs/client";
import { Preloaded } from "convex/react";
import { Copy, Ellipsis,  MessageSquare, SquarePen, Star, ThumbsUp, Trash2, TriangleAlert } from "lucide-react";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RxLinkedinLogo } from "react-icons/rx";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DeleteBlogDialog } from "./DeleteBlogDialog";

interface IncrementBlogLikesProps {
  blog: Doc<"blogs">;
  preloadedUser: Preloaded<typeof api.auth.getCurrentUser>;
  preloadedVoteState: Preloaded<typeof api.blogs.getBlogVoteState>;
  preloadedCommentCount: Preloaded<typeof api.comments.getCommentNumber>;
  preloadedFeaturedState: Preloaded<typeof api.blogs.getBlogFeaturedState>
}

export function IncrementBlogLikesDislikes({ 
  blog, 
  preloadedUser, 
  preloadedVoteState, 
  preloadedCommentCount,
  preloadedFeaturedState 
}: IncrementBlogLikesProps) {

  const convex = useConvex();
  
  const currentUser = usePreloadedAuthQuery(preloadedUser);
  const voteState = usePreloadedQuery(preloadedVoteState);
  const displayComments = usePreloadedQuery(preloadedCommentCount);

  const featuredState = usePreloadedQuery(preloadedFeaturedState);

  const [isVotePending, startVoteTransition] = useTransition();
  const [isFeaturedPending, startFeaturedTransition] = useTransition();

  const userEmail = currentUser?.email;
  const isCompanyUser = userEmail?.endsWith("@taqtiq.tech");

  const router = useRouter(); 
  
  const hasLiked = voteState?.hasVoted;
  const likesCount = voteState?.likes; 

  const isFeatured = featuredState?.isFeatured;

  const prefetchBlog = () => {
    convex.query(api.blogs.getBlogById, { blogId: blog._id }).catch((err) => {
      console.error("Prefetch failed:", err);
    });
  };

  const toggleBlogVoteMutation = useMutation(api.blogs.toggleBlogVote)
    .withOptimisticUpdate((localStore, args) => {
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
  });

  const toggleFeaturedMutation = useMutation(api.blogs.toggleFeatured)
    .withOptimisticUpdate((localStore, args) => {
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
  });

  const handleLikeClick = async () => {
    if (isVotePending) return;

    if (currentUser === null) {
      toast.error("You must be logged in to like an article.");
      return;
    }

    startVoteTransition(async () => {
      try {
        await toggleBlogVoteMutation({ blogId: blog._id });
      } catch (error) {
        console.error("Failed to process like:", error);
        toast.error("Failed to update your like.");
      }
    });
  };

  const handleFeaturedClick = async () => {
    if (isFeaturedPending) return;

    if (currentUser === null) {
      toast.error("You must be logged in to feature an article.");
      return;
    }

    startFeaturedTransition(async () => {
      try {
        await toggleFeaturedMutation({ blogId: blog._id });
      } catch (error) {
        console.error("Failed to process featured:", error);
        toast.error("Failed to update your feature.");
      }
    });
  };

  const scrollToView = () => {
    document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col items-center gap-2 p-6 text-muted-foreground text-xs">
      <Button 
        variant="ghost" 
        onClick={handleLikeClick}
        className="h-12 w-12 rounded-full text-muted-foreground hover:text-foreground"
      >
        <ThumbsUp
          className={`!h-5 !w-5 transition-none ${
            hasLiked ? "text-emerald-500" : ""
          }`}
          fill={hasLiked ? "currentColor" : "none"}
        />
        <span className={hasLiked ? "text-emerald-500 font-bold" : ""}>
          {likesCount}
        </span>
      </Button>

      <Button 
        variant="ghost" 
        className="h-12 w-12 rounded-full transition-all text-muted-foreground hover:text-foreground"
        onClick={scrollToView}
      >
        <MessageSquare className="!h-5 !w-5 transition-transform active:scale-90" />
        <span>{displayComments}</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button 
                variant="ghost" 
                className="h-12 w-12 rounded-full transition-all text-muted-foreground hover:text-foreground disabled:opacity-100"
            >
                <Ellipsis
                    className="!h-5 !w-5 transition-transform active:scale-90"
                />
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-48">
            <DropdownMenuLabel>Share</DropdownMenuLabel>
            
            <DropdownMenuItem 
                className="font-bold cursor-pointer flex items-center gap-2 whitespace-nowrap"
                onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied to clipboard!");
                }}
            >
                <Copy className="h-4 w-4 shrink-0" strokeWidth={3} />
                <span>Copy link</span>
            </DropdownMenuItem>

            <DropdownMenuItem 
                className="cursor-pointer flex items-center gap-2 whitespace-nowrap"
                onClick={() => {
                    const shareUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent("Check out this article!")}`;
                    window.open(shareUrl, "_blank", "noopener,noreferrer");
                }}
            >
                <FaXTwitter className="h-4 w-4 shrink-0" />
                <span>X (Twitter)</span>
            </DropdownMenuItem>

            <DropdownMenuItem 
                className="cursor-pointer flex items-center gap-2 whitespace-nowrap"
                onClick={() => {
                    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
                    window.open(shareUrl, "_blank", "noopener,noreferrer");
                }}
            >
                <RxLinkedinLogo className="h-4 w-4 shrink-0" />
                <span>LinkedIn</span>
            </DropdownMenuItem>

            <DropdownMenuItem 
                className="cursor-pointer flex items-center gap-2 whitespace-nowrap"
                onClick={() => {
                    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
                    window.open(shareUrl, "_blank", "noopener,noreferrer");
                }}
            >
                <FaFacebook className="h-4 w-4 shrink-0" />
                <span>Facebook</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
    {isCompanyUser && (
        <>
            <div className="w-1/2 mx-auto">
                <Separator />
            </div>

            <Button 
                variant="ghost" 
                onClick={handleFeaturedClick} 
                className="h-12 w-12 rounded-full transition-all text-muted-foreground hover:text-foreground disabled:opacity-100"
            >
                <Star
                    className={`!h-5 !w-5 transition-all active:scale-90 ${
                        isFeatured ? "text-amber-500 fill-amber-500" : ""
                    }`}
                />
            </Button>

            <Button 
                variant="ghost" 
                className="h-12 w-12 rounded-full transition-all text-muted-foreground hover:text-foreground disabled:opacity-100"
                asChild
            >
                <Link
                  href={`/company/blog?id=${blog._id}`}
                  onMouseEnter={prefetchBlog}
                >
                    <SquarePen className="!h-5 !w-5 transition-transform active:scale-90" />
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
                    className="h-12 w-12 rounded-full transition-all text-muted-foreground hover:text-destructive disabled:opacity-100"
                >
                  <Trash2 className="!h-5 !w-5 transition-transform active:scale-90" />
                </Button>
              }
            />
        </>
      )}
    </div>
  );
}