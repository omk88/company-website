"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { Bell, BellPlus, Loader2 } from "lucide-react";
import { AnimatePresence, motion, LayoutGroup, Transition } from "framer-motion";

interface FollowButtonProps {
  userId: string;
  username: string;
  displayName: string | undefined;
  initialIsFollowing?: boolean;
  initialIsBell?: boolean;
  isSelf?: boolean;
  variant?: "default" | "compact" | "xs";
}

const springConfig: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 35,
  mass: 0.8,
};

export function FollowButton({
  userId,
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
  const isXS = variant === "xs";

  const followMutation = useMutation(api.profiles.toggleFollow);
  const bellMutation = useMutation(api.profiles.toggleBell);

  const handleFollowClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsPending(true);

    try {
      const result = await followMutation({ targetUserId: userId });

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

  const handleBellClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsBellPending(true);

    try {
      const result = await bellMutation({ targetUserId: userId });

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

  const heightClass = isCompact || isXS ? "h-6" : "h-7";
  const bellSize = isCompact || isXS ? 24 : 28;
  const iconSizeClass = isCompact || isXS ? "h-3 w-3" : "h-3.5 w-3.5";
  const buttonSize = isXS ? "xs" : isCompact ? "xs" : "sm";
  const buttonPadding = isXS
    ? "px-2.5 py-1"
    : isCompact
      ? "px-3"
      : "px-4 py-0";

  return (
    <LayoutGroup>
      <motion.div
        layout
        transition={springConfig}
        className={`flex flex-row items-center gap-1.5 w-full ${heightClass} overflow-hidden`}
      >
        <AnimatePresence mode="sync" initial={false}>
          {isFollowing && (
            <motion.div
              key="bell-container"
              initial={{ opacity: 0, width: 0, scale: 0.8 }}
              animate={{ opacity: 1, width: bellSize, scale: 1 }}
              exit={{ opacity: 0, width: 0, scale: 0.8 }}
              transition={springConfig}
              className="shrink-0 flex items-center h-full overflow-hidden"
            >
              <Button
                size="icon"
                variant="ghost"
                className={`${heightClass} w-full rounded-full cursor-pointer shrink-0 p-0`}
                disabled={isBellPending}
                onClick={handleBellClick}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={isBellPending ? "loading" : isBell ? "active" : "inactive"}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center justify-center"
                  >
                    {isBellPending ? (
                      <Loader2 className={`${iconSizeClass} animate-spin`} />
                    ) : isBell ? (
                      <Bell className={`${iconSizeClass} fill-current stroke-[2.3]`} />
                    ) : (
                      <BellPlus className={`${iconSizeClass} stroke-[2.3]`} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div layout transition={springConfig} className="flex-1 h-full min-w-0">
          <Button
            variant={isFollowing ? "outline" : "default"}
            className={`cursor-pointer text-xs w-full h-full box-border leading-none rounded-full font-medium transition-colors ${buttonPadding}`}
            size={buttonSize}
            disabled={isPending}
            onClick={handleFollowClick}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isPending ? "loading" : isFollowing ? "unfollow" : "follow"}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.12 }}
                className="flex items-center justify-center w-full"
              >
                {isPending ? (
                  <Loader2 className={`${iconSizeClass} animate-spin`} />
                ) : isFollowing ? (
                  "Unfollow"
                ) : (
                  "Follow"
                )}
              </motion.span>
            </AnimatePresence>
          </Button>
        </motion.div>
      </motion.div>
    </LayoutGroup>
  );
}