import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { cacheLife, cacheTag } from "next/cache";
import FeaturedBlogMarquee from "./FeaturedBlogMarquee";

export async function CachedFeaturedBlogsMarquee() {
    "use cache";
    cacheTag("blog");  
    cacheLife("days"); 

    const posts = await fetchQuery(api.blogs.getPosts);


    return <FeaturedBlogMarquee posts={posts ?? []} />;
}