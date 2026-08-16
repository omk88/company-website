"use client";

import { ProfileHoverCard } from "../ProfileHoverCard";

interface BlogNameProps {
    username: string;
    displayName: string | undefined;
}

export function BlogName({ username, displayName }: BlogNameProps) {
    return (
        <ProfileHoverCard authorUsername={username} displayName={displayName}>
            <span className="cursor-pointer">
            {displayName || username}
            </span>
        </ProfileHoverCard>
    )
}