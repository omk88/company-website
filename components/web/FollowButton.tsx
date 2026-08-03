import { useState } from "react";
import { Button } from "../ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface FollowButtonProps {
  targetProfileId: Id<"profiles">;
  username: string;
  displayName: string | undefined;
  initialIsFollowing?: boolean;
}

export function FollowButton({ targetProfileId, username, displayName, initialIsFollowing = false }: FollowButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

  const followMutation = useMutation(api.profiles.toggleFollow);

  const handleClick = async () => {
    setIsPending(true);

    try {
      const result = await followMutation({ targetProfileId });

      if (result?.isFollowing) {
        setIsFollowing(true);
        toast.success(`Following ${displayName || username}`);
      } else {
        setIsFollowing(false);
        toast.success(`Unfollowed ${displayName || username}`);
      }
    } catch (error) {
      toast.error(`Error updating follow status for ${displayName || username}`);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      className="cursor-pointer min-w-[100px]"
      disabled={isPending} 
      onClick={handleClick}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        "Unfollow"
      ) : (
        "Follow"
      )}
    </Button>
  );
}