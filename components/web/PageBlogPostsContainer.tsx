import { fetchQuery, preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { cacheLife, cacheTag } from "next/cache";
import { PageBlogPosts } from "@/components/web/PageBlogPosts";

export async function PageBlogPostsContainer() {
    "use cache";
    cacheTag("main-blogs");  
    cacheLife("days"); 

    const initialBlogs = await fetchQuery(api.blogs.getPaginatedPostsByType, {
        postType: "community",
        paginationOpts: {
            numItems: 6,    
            cursor: null,   
            id: 0,
        }
    });

    return <PageBlogPosts initialBlogs={initialBlogs} />;
}