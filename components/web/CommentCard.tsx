import { Doc } from "@/convex/_generated/dataModel";
import { IncrementCommentLikesDislikes } from "./IncrementCommentLikesDislikes";
import { Separator } from "../ui/separator";
import { formatSmartDate } from "./ProfileHoverCard";
import { Copy, Ellipsis, ThumbsUp } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RxLinkedinLogo } from "react-icons/rx";
import { toast } from "sonner";
import { Button } from "../ui/button";

export type CommentPreview = Doc<"comments">;

interface CommentProps {
  comment: CommentPreview; 
  index: number; 
  variant?: "default" | "compact";
}

export function CommentCard({ comment, index, variant }: CommentProps) {

    const isCompact = variant === "compact";

    const ShareMenu = () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button 
                variant="ghost" 
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground pointer-events-auto cursor-pointer"
            >
                <Ellipsis className="w-4 h-4 stroke-[2.3]" />
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
            <DropdownMenuLabel>Share</DropdownMenuLabel>
            <DropdownMenuItem 
                className="font-bold cursor-pointer flex items-center gap-2 whitespace-nowrap"
                onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard.");
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
    );

    if (isCompact) {
        return (
            <div className="group flex flex-col px-3 pt-1.5 pb-3 bg-zinc-50/80 hover:bg-zinc-100/90 rounded-xl transition-colors duration-100 dark:bg-muted/30">
                <div className="flex items-center justify-between text-[11px] font-sans uppercase tracking-wider text-zinc-600 dark:text-zinc-400 leading-none">
                    <span className="line-clamp-1"><time>{formatSmartDate(comment._creationTime, false)}</time>  •  {comment.blogTitle}</span>
                    <ShareMenu />
                </div>
                <div className="text-sm line-clamp-3">
                    {comment.body}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs font-extralight tracking-tight select-none">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{comment.likes}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col items-start p-4">
                <h1 className="text-sm text-muted-foreground font-bold tracking-tight line-clamp-1 md:line-clamp-2 text-foreground transition-colors duration-200 group-hover:text-blue-600 uppercase break-words">
                    { comment.blogTitle }
                </h1>
                <h2 className="font-bold">{comment.displayName || comment.username} • {new Date(comment._creationTime).toLocaleDateString("en-US")}</h2>
                <span>{comment.body}</span>
                <IncrementCommentLikesDislikes comment={comment} />
                <Separator />
            </div>
        </div>
    )
}