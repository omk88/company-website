import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { cacheLife, cacheTag } from "next/cache";
import { FeaturedBlogsClient } from "./FeaturedBlogsClient";

export async function FeaturedBlogs() {
    "use cache";
    cacheTag("featured-blogs");  
    cacheLife("days"); 

    const featuredBlogs = await fetchQuery(api.blogs.getFeaturedPosts) ?? [];

    return <FeaturedBlogsClient initialFeaturedBlogs={featuredBlogs} />;
}