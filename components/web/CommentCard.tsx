"use client";

import { useRouter } from "next/navigation";
import { Doc } from "@/convex/_generated/dataModel";
import { IncrementCommentLikesDislikes } from "./IncrementCommentLikesDislikes";
import { Separator } from "../ui/separator";
import { formatSmartDate } from "./ProfileHoverCard";
import { ThumbsUp } from "lucide-react";

export type CommentPreview = Doc<"comments">;

interface CommentProps {
  comment: CommentPreview; 
  index: number; 
  variant?: "default" | "compact";
}

export function CommentCard({ comment, index, variant }: CommentProps) {
  const router = useRouter();
  const isCompact = variant === "compact";

  const handleCompactClick = () => {
    const targetPath = `/insights/${comment.blogId}`;
    const commentHash = `#comment-${comment._id}`;
    
    const cleanUrl = new URL(targetPath, window.location.origin);
    cleanUrl.hash = commentHash;

    const currentPathWithoutHash = window.location.pathname;

    if (currentPathWithoutHash === targetPath) {
      window.history.replaceState(null, "", cleanUrl.toString());
      
      const el = document.getElementById(`comment-${comment._id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(`${cleanUrl.pathname}${cleanUrl.hash}`);
    }
  };

  if (isCompact) {
    return (
      <div 
        onClick={handleCompactClick}
        className="group flex flex-col p-3 gap-2 bg-zinc-50/80 hover:bg-zinc-100/90 rounded-xl transition-colors duration-100 dark:bg-muted/30 cursor-pointer"
      >
        <div className="text-sm line-clamp-3">
          {comment.body}
        </div>
        <div className="flex items-center justify-between text-xs font-extralight tracking-tight select-none">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{comment.likes}</span>
            </div>
            <time className="text-xs text-zinc-400">
              {formatSmartDate(comment._creationTime, false)}
            </time>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-start p-4">
        <h1 className="text-sm text-muted-foreground font-bold tracking-tight line-clamp-1 md:line-clamp-2 text-foreground transition-colors duration-200 group-hover:text-blue-600 uppercase break-words">
          {comment.blogTitle}
        </h1>
        <h2 className="font-bold">
          {comment.displayName || comment.username} • {new Date(comment._creationTime).toLocaleDateString("en-US")}
        </h2>
        <span>{comment.body}</span>
        <IncrementCommentLikesDislikes comment={comment} />
        <Separator />
      </div>
    </div>
  );
}