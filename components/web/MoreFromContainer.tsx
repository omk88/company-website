import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { cacheLife, cacheTag } from "next/cache";
import { MoreFromClient } from "./MoreFromClient";

interface MoreFromContainerProps {
  authorName: string;
}

export async function MoreFromContainer({ authorName }: MoreFromContainerProps) {
    "use cache";
    cacheTag("trending-blogs");  
    cacheLife("hours");

    const postsByAuthor = await fetchQuery(api.blogs.getPostsByAuthor, { authorName }) ?? [];

    return <MoreFromClient initialBlogs={postsByAuthor} />;
}