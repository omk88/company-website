import { useState } from "react";
import { Button } from "../ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { Bell, BellPlus, Loader2 } from "lucide-react";

interface FollowButtonProps {
  targetProfileId: Id<"profiles">;
  username: string;
  displayName: string | undefined;
  initialIsFollowing?: boolean;
  initialIsBell?: boolean;
  variant?: "default" | "compact";
}

export function FollowButton({
  targetProfileId,
  username,
  displayName,
  initialIsFollowing = false,
  initialIsBell = false,
  variant,
}: FollowButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [isBellPending, setIsBellPending] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isBell, setIsBell] = useState(initialIsBell);

  const isCompact = variant === "compact";

  const followMutation = useMutation(api.profiles.toggleFollow);
  const bellMutation = useMutation(api.profiles.toggleBell);

  const handleFollowClick = async () => {
    setIsPending(true);

    try {
      const result = await followMutation({ targetProfileId });

      if (result?.isFollowing) {
        setIsFollowing(true);
        toast.success(`Following ${displayName || username}`);
      } else {
        setIsFollowing(false);
        setIsBell(false);
        toast.success(`Unfollowed ${displayName || username}`);
      }
    } catch (error) {
      toast.error(`Error updating follow status for ${displayName || username}`);
    } finally {
      setIsPending(false);
    }
  };

  const handleBellClick = async () => {
    setIsBellPending(true);

    try {
      const result = await bellMutation({ targetProfileId });

      if (result?.isBell) {
        setIsBell(true);
        toast.success(`Turned on notifications for ${displayName || username}`);
      } else {
        setIsBell(false);
        toast.success(`Turned off notifications for ${displayName || username}`);
      }
    } catch (error) {
      toast.error(`Error updating notification settings for ${displayName || username}`);
    } finally {
      setIsBellPending(false);
    }
  };

  if (isCompact) {
    return (
      <div className="flex flex-row gap-1.5 w-full items-center">
        {isFollowing && (
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 rounded-full cursor-pointer shrink-0"
            disabled={isBellPending}
            onClick={handleBellClick}
          >
            {isBellPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : isBell ? (
              <Bell className="h-3 w-3 fill-current stroke-[2.3]" />
            ) : (
              <BellPlus className="h-3 w-3 stroke-[2.3]" />
            )}
          </Button>
        )}

        <Button
          variant={isFollowing ? "outline" : "default"}
          className="cursor-pointer text-xs px-2 flex-1"
          size="xs"
          disabled={isPending}
          onClick={handleFollowClick}
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
    );
  }

  return (
    <div className="flex flex-row gap-2 w-full items-center">
      {isFollowing && (
        <Button
          size={"icon"}
          variant={"ghost"}
          className="rounded-4xl cursor-pointer shrink-0"
          disabled={isBellPending}
          onClick={handleBellClick}
        >
          {isBellPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isBell ? (
            <Bell className="h-4 w-4 fill-current stroke-[2.3]" />
          ) : (
            <BellPlus className="h-4 w-4 stroke-[2.3]" />
          )}
        </Button>
      )}

      <Button
        variant={isFollowing ? "outline" : "default"}
        className="cursor-pointer text-xs flex-1"
        size={"sm"}
        disabled={isPending}
        onClick={handleFollowClick}
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