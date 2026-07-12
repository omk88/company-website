import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { cacheLife, cacheTag } from "next/cache";
import { MoreFromClient } from "./MoreFromClient";

interface MoreFromContainerProps {
  author: string;
}

export async function MoreFromContainer({ author }: MoreFromContainerProps) {
    "use cache";
    cacheTag("trending-blogs");  
    cacheLife("hours");

    const postsByAuthor = await fetchQuery(api.blogs.getPostsByAuthor, { author }) ?? [];

    return <MoreFromClient initialBlogs={postsByAuthor} />;
}