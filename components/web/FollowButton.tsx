import { useState } from "react";
import { Button } from "../ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { BellPlus, Loader2 } from "lucide-react";

interface FollowButtonProps {
  targetProfileId: Id<"profiles">;
  username: string;
  displayName: string | undefined;
  initialIsFollowing?: boolean;
  variant?: "default" | "compact";
}

export function FollowButton({ targetProfileId, username, displayName, initialIsFollowing = false, variant }: FollowButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

  const isCompact = variant === "compact";

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

  if (isCompact) {
    return (
      <div className="flex flex-row gap-1.5 w-full items-center">
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 rounded-full cursor-pointer shrink-0"
        >
          <BellPlus className="h-2 w-2 stroke-[2.3]" />
        </Button>
        
        <Button
          variant={isFollowing ? "outline" : "default"}
          className="cursor-pointer text-xs px-2 flex-1"
          size="xs"
          disabled={isPending} 
          onClick={handleClick}
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : isFollowing ? (
            "Unfollow"
          ) : (
            "Follow"
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-row gap-2 w-full items-center">
      <Button
        size={"icon"}
        variant={"ghost"}
        className="rounded-4xl cursor-pointer shrink-0"
      >
        <BellPlus className="stroke-[2.3]" />
      </Button>
      
      <Button
        variant={isFollowing ? "outline" : "default"}
        className="cursor-pointer text-xs flex-1"
        size={"sm"}
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
    </div>
  );
}