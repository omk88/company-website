import { Doc } from "@/convex/_generated/dataModel";

export type CommentPreview = Doc<"comments">;

interface CommentProps {
  comment: CommentPreview; 
  index: number; 
}

export function CommentCard({ comment, index }: CommentProps) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col">
                <span>Index: { index }</span>
                <span>By: {comment.authorName}</span>
                <span>Body: {comment.body}</span>
            </div>
        </div>
    )
}