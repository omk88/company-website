import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { Bell, BellPlus, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface FollowButtonProps {
  targetProfileId: Id<"profiles">;
  username: string;
  displayName: string | undefined;
  initialIsFollowing?: boolean;
  initialIsBell?: boolean;
  isSelf?: boolean;
  variant?: "default" | "compact";
}

export function FollowButton({
  targetProfileId,
  username,
  displayName,
  initialIsFollowing = false,
  initialIsBell = false,
  isSelf = false,
  variant,
}: FollowButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [isBellPending, setIsBellPending] = useState(false);

  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isBell, setIsBell] = useState(initialIsBell);

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  useEffect(() => {
    setIsBell(initialIsBell);
  }, [initialIsBell]);

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

  if (isSelf) return null;

  if (isCompact) {
    return (
      <motion.div layout className="flex flex-row gap-1.5 w-full items-center h-6">
        <AnimatePresence mode="popLayout" initial={false}>
          {isFollowing && (
            <motion.div
              key="bell-compact"
              initial={{ scale: 0, opacity: 0, width: 0 }}
              animate={{ scale: 1, opacity: 1, width: "auto" }}
              exit={{ scale: 0, opacity: 0, width: 0 }}
              className="shrink-0 flex items-center h-full overflow-hidden"
            >
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
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div layout className="flex-1 h-full">
          <Button
            variant={isFollowing ? "outline" : "default"}
            className="cursor-pointer text-xs px-3 w-full h-full box-border leading-none rounded-full font-medium"
            size="xs"
            disabled={isPending}
            onClick={handleFollowClick}
          >
            {isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : isFollowing ? (
              "Unfollow"
            ) : (
              "Follow"
            )}
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div layout className="flex flex-row gap-1.5 w-full items-center h-7">
      <AnimatePresence mode="popLayout" initial={false}>
        {isFollowing && (
          <motion.div
            key="bell-default"
            initial={{ scale: 0, opacity: 0, width: 0 }}
            animate={{ scale: 1, opacity: 1, width: "auto" }}
            exit={{ scale: 0, opacity: 0, width: 0 }}
            className="shrink-0 flex items-center h-full overflow-hidden"
          >
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-full cursor-pointer shrink-0 p-0"
              disabled={isBellPending}
              onClick={handleBellClick}
            >
              {isBellPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : isBell ? (
                <Bell className="h-3.5 w-3.5 fill-current stroke-[2.3]" />
              ) : (
                <BellPlus className="h-3.5 w-3.5 stroke-[2.3]" />
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div layout className="flex-1 h-full">
        <Button
          variant={isFollowing ? "outline" : "default"}
          className="cursor-pointer text-xs px-4 w-full h-full box-border py-0 leading-none rounded-full font-medium"
          size="sm"
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
      </motion.div>
    </motion.div>
  );
}