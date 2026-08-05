import { Doc } from "@/convex/_generated/dataModel";
import { IncrementCommentLikesDislikes } from "./IncrementCommentLikesDislikes";
import { Separator } from "../ui/separator";

export type CommentPreview = Doc<"comments">;

interface CommentProps {
  comment: CommentPreview; 
  index: number; 
}

export function CommentCard({ comment, index }: CommentProps) {
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