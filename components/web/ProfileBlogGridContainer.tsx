import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { cacheLife, cacheTag } from "next/cache";
import { BlogGridManager } from "./BlogGridManager";

interface ProfileBlogGridContainerProps {
    username: string;
}

export async function ProfileBlogGridContainer({ username }: ProfileBlogGridContainerProps) {
    "use cache";
    cacheTag("trending-blogs");  
    cacheLife("hours");

    const profileData = await fetchQuery(api.profiles.getProfileByUsername, { username });
    const profileId = profileData?.profile?._id;

    if (!profileId) {
        return <div>Profile not found</div>;
    }

    const postsByAuthor = await fetchQuery(api.blogs.getPostsByAuthor, { author: profileId });

    return (
        <BlogGridManager 
            initialServerPosts={postsByAuthor} 
            disableSearch={true} 
            author={profileId}
        />
    );
}