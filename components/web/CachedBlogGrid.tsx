import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { cacheLife, cacheTag } from "next/cache";
import { BlogGridManager } from "./BlogGridManager";

export async function CachedBlogGrid() {
    "use cache";
    cacheTag("blog");  
    cacheLife("days"); 

    const initialData = await fetchQuery(api.blogs.getPaginatedPosts, {
        paginationOpts: { numItems: 9, cursor: null },
        sortOrder: "new"
    }) ?? { page: [], isDone: false, continueCursor: "" };

    return <BlogGridManager initialServerPosts={initialData.page} />;
}