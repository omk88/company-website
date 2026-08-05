import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Id } from "@/convex/_generated/dataModel";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface FollowsDialogProps {
    profileId: Id<"profiles">;
    trigger: React.ReactNode;
    onMouseEnter?: () => void;
}

export function FollowsDialog({ profileId, trigger, onMouseEnter }: FollowsDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const { results, status, loadMore } = usePaginatedQuery(
        api.profiles.getProfileFollowers,
        isOpen || onMouseEnter ? { profileId } : "skip",
        { initialNumItems: 10 }
    );

    useEffect(() => {
        if (status !== "CanLoadMore" || !isOpen) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore(10);
                }
            },
            {
                threshold: 0.5,
            }
        );

        const currentRef = loadMoreRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [status, loadMore, isOpen]);
    
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild onMouseEnter={onMouseEnter}>
            {trigger}
        </DialogTrigger>

        <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
            <DialogHeader>
                <DialogTitle>Followers</DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 mt-2">
                {status === "LoadingFirstPage" ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : results.length === 0 ? (
                    <p className="text-center text-muted-foreground py-6 text-sm">
                    No followers yet.
                    </p>
                ) : (
                    results.map((follower) => {
                    if (!follower) return null;

                    return (
                        <Link
                            key={follower._id}
                            href={`/profile/${follower.username}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-100 transition-colors"
                            >
                            <img
                                src={follower.profilePicUrl || follower.defaultProfilePic || ""}
                                alt={follower.displayName || follower.username}
                                className="h-10 w-10 rounded-full object-cover shrink-0 bg-muted"
                            />
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-semibold truncate leading-none">
                                {follower.displayName || follower.username}
                                </span>
                                <span className="text-xs text-muted-foreground truncate mt-1">
                                @{follower.username}
                                </span>
                            </div>
                        </Link>
                    );
                    })
                )}

                {(status === "CanLoadMore" || status === "LoadingMore") && (
                    <div ref={loadMoreRef} className="flex justify-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                )}
            </div>
        </DialogContent>
      </Dialog>
    )
}