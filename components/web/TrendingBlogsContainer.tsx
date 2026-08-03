import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { cacheLife, cacheTag } from "next/cache";
import { TrendingBlogsClient } from "./TrendingBlogsClient";

export async function TrendingBlogs() {
    "use cache";
    cacheTag("trending-blogs");  
    cacheLife("hours");

    const trendingPosts = await fetchQuery(api.blogs.getTrendingPosts);

    return <TrendingBlogsClient initialTrendingBlogs={trendingPosts} />;
}