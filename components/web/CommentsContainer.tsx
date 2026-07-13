import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import { CommentCard } from "./CommentCard"

export function CommentsContainer() {

    const comments = useQuery(api.comments.getCommentsByAuthor, {authorId: "k17b55bsmjhfrcaz32wmjksvk98adb38"})

    return (
        <ul>
            {comments?.map((comment, index) => (
                <CommentCard comment={comment} index={index} />
            ))}
        </ul>
    )
}