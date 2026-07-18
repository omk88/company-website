import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import { CommentCard } from "./CommentCard"
import { Id } from "@/convex/_generated/dataModel";

interface CommentsContainerProps {
    authorId: Id<"profiles">;
}

export function CommentsContainer({ authorId }: CommentsContainerProps) {

    const comments = useQuery(api.comments.getCommentsByAuthor, {authorId: authorId})

    return (
        <ul className="space-y-4">
            {comments?.map((comment, index) => (
                <CommentCard key={comment._id} comment={comment} index={index} />
            ))}
        </ul>
    )
}