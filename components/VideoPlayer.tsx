import { api } from "@/convex/_generated/api";
import { FunctionReturnType } from "convex/server";
import { formatSmartDate, ProfileHoverCard } from "./web/ProfileHoverCard";

type PaginatedBlogsResult = FunctionReturnType<typeof api.blogs.getPaginatedPostsByType>;
export type BlogPostItem = PaginatedBlogsResult["page"][number];

interface VideoPlayerProps {
    blog: BlogPostItem;
}

export default function VideoPlayer({ blog }: VideoPlayerProps) {
    return (
        <div className="flex flex-col w-full border border-border/50 rounded-none overflow-hidden">
            <div className="px-2 pb-1">
                <h3 className="leading-tight py-1 text-xl font-bold tracking-tight line-clamp-2 text-foreground break-words">
                    {blog.title}
                </h3>
                <div className="font-roboto flex text-xs uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                    <ProfileHoverCard authorUsername={blog.username} displayName={blog.displayName || blog.username}>
                        <span className="cursor-pointer">{blog.displayName || blog.username}</span>
                    </ProfileHoverCard>
                    {" "} &middot; {formatSmartDate(blog._creationTime, false)}
                </div>
            </div>

            <video
                controls
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full bg-black h-90 object-cover"
                src={blog.videoUrl || ""}
            >
                Your browser does not support the video tag.
            </video>
        </div>
    );
}