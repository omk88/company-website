import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { BlogFeedWrapper } from "./BlogFeedWrapper";
import { connection } from "next/server";

export async function PageBlogPosts() {

  await connection();
  
  const preloadedData = await preloadQuery(
    api.blogs.getPaginatedPostsByType,
    {
      sortOrder: "new",
      paginationOpts: {
        numItems: 6,
        cursor: null,
      },
    }
  );

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 p-2">
      <BlogFeedWrapper preloadedData={preloadedData} />
    </div>
  )
}