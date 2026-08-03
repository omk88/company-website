import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { cacheLife, cacheTag } from "next/cache";
import { MoreFromClient } from "./MoreFromClient";
import { Id } from "@/convex/_generated/dataModel";

interface MoreFromContainerProps {
  author: string;
  displayName: string | undefined;
  username: string;
  blogId: Id<"blogs">;
}

export async function MoreFromContainer({ author, displayName, username, blogId }: MoreFromContainerProps) {
    "use cache";
    cacheTag("morefrom-blogs");  
    cacheLife("hours");

    const postsByAuthor = await fetchQuery(api.blogs.getPostsByAuthor, { author, excludeId: blogId });

    return <MoreFromClient initialBlogs={postsByAuthor} displayName={displayName} username={username} />;
}