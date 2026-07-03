import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { cacheLife, cacheTag } from "next/cache";
import { BlogGridManager } from "./BlogGridManager";

export async function CachedBlogGrid() {
    "use cache";
    cacheTag("blog");  
    cacheLife("days"); 

    const posts = await fetchQuery(api.blogs.getPosts) ?? [];

    return <BlogGridManager allPosts={posts} />;
}