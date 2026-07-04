import { cacheLife, cacheTag } from "next/cache";
import { BlogGridManager } from "./BlogGridManager";

export async function CachedBlogGrid() {
    "use cache";
    cacheTag("blog");  
    cacheLife("days"); 

    return <BlogGridManager/>;
}