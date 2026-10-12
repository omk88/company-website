"use client";

interface BlogLastUpdatedProps {
    date?: number;
}

export function BlogLastUpdated({ date }: BlogLastUpdatedProps) {
    
    if (!date) return;
    
    return (
        <div>
            <span>Last Updated: </span>
            <time dateTime={new Date(date).toISOString()}>
                {new Date(date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                })}
            </time>
        </div>
    )
}