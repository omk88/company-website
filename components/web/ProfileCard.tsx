interface ProfileCardProps {
    userId: string;
    displayName: string;
    username: string;
    avatarUrl: string;
}

export function ProfileCard({ userId, displayName, username, avatarUrl }: ProfileCardProps) {
    return (
        <div>
            <span>{username}</span>
        </div>
    )
}