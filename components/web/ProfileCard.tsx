import { Id } from "@/convex/_generated/dataModel";
import { FollowButton } from "./FollowButton";
import { ProfileHoverCard } from "./ProfileHoverCard";
import Link from "next/link";

interface ProfileCardProps {
    userId: string;
    displayName: string;
    username: string;
    profilePicture: string | null;
    defaultProfilePicture: string | null;
}

export function ProfileCard({ userId, displayName, username, profilePicture, defaultProfilePicture }: ProfileCardProps) {
    return (
        <Link 
            href={`/${username}`}
        >
            <div className="flex flex-row items-center gap-2 px-4 py-2 bg-zinc-50/80 hover:bg-zinc-100/90 rounded-xl cursor-pointer">
                <div className="h-12 w-12 border-2 border-muted rounded-full overflow-hidden bg-muted relative shrink-0">
                <img
                    src={profilePicture || defaultProfilePicture || ""}
                    alt="profile"
                    className="h-full w-full object-cover rounded-full"
                    decoding="async" 
                />
                </div>
                <div className="flex flex-col">
                    <ProfileHoverCard authorUsername={username} displayName={displayName || username}>
                        <span className="text-sm font-semibold cursor-pointer">{displayName || username}</span>
                    </ProfileHoverCard>
                    <span className="text-xs font-extralight text-zinc-600 dark:text-zinc-400">@{username}</span>
                </div>
                <div className="ml-auto shrink-0">
                    <FollowButton targetProfileId={userId as Id<"profiles">} username={username} displayName={displayName} initialIsFollowing={true} variant="compact" />
                </div>
            </div>
        </Link>
    )
}