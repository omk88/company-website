import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { cacheLife, cacheTag } from "next/cache";
import { BlogGridManager } from "./BlogGridManager";

interface CachedBlogGridProps {
  searchParams: {
    search?: string;
    sort?: string;
    tags?: string;
    page?: string;
  };
}

export async function CachedBlogGrid({ searchParams }: CachedBlogGridProps) {
    "use cache";
    cacheTag("blog");  
    cacheLife("days"); 

    let posts = await fetchQuery(api.blogs.getPosts) ?? [];

    if (searchParams.tags) {
        const selectedTags = searchParams.tags.split(",");
        posts = posts.filter(post => 
            selectedTags.every(tag => post.tags?.some((t: string) => t.toLowerCase() === tag.toLowerCase()))
        );
    }

    if (searchParams.search) {
        const query = searchParams.search.toLowerCase();
        posts = posts.filter(post => 
            post.title.toLowerCase().includes(query) || 
            (post.subtitle && post.subtitle.toLowerCase().includes(query))
        );
    }

    posts = [...posts].sort((a, b) => {
        if (searchParams.sort === "oldest") return a._creationTime - b._creationTime;
        if (searchParams.sort === "title-az") return a.title.localeCompare(b.title);
        if (searchParams.sort === "title-za") return b.title.localeCompare(a.title);
        return b._creationTime - a._creationTime;
    });

    return <BlogGridManager allPosts={posts} />;
}