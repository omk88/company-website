import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { cacheLife, cacheTag } from "next/cache";
import { BlogGrid } from "./BlogGrid";

export async function CachedBlogGrid() {
    "use cache";
    cacheLife("hours");
    cacheTag("blog");   

    const posts = await fetchQuery(api.blogs.getPosts);

    return <BlogGrid initialPosts={posts ?? []} />;
}