import { FollowButton } from "./FollowButton";
import { ProfileHoverCard } from "./ProfileHoverCard";

interface ProfileCardProps {
    userId: string;
    displayName: string;
    username: string;
    profilePicture: string | null;
    defaultProfilePicture: string | null;
}

export function ProfileCard({ userId, displayName, username, profilePicture, defaultProfilePicture }: ProfileCardProps) {
    return (
        <div className="flex flex-row gap-2">
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
        </div>
    )
}