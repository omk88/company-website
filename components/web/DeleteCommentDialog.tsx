import { Id } from "@/convex/_generated/dataModel";

interface DeleteCommentProps {
    commentIds: Id<"comments">[];
    trigger?: React.ReactNode;
    onSuccess?: () => void;
}

export function DeleteCommentDialog({ commentIds, trigger, onSuccess }: DeleteCommentProps) {
    return (
        <></>
    )
}