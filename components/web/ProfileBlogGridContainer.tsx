import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { cacheLife, cacheTag } from "next/cache";
import { BlogGridManager } from "./BlogGridManager";

interface ProfileBlogGridContainerProps {
  authorName: string;
}

export async function ProfileBlogGridContainer({ authorName }: ProfileBlogGridContainerProps) {
    "use cache";
    cacheTag("trending-blogs");  
    cacheLife("hours");

    const postsByAuthor = await fetchQuery(api.blogs.getPostsByAuthor, { authorName }) ?? [];

    return <BlogGridManager initialServerPosts={postsByAuthor} disableSearch={true} />;
}