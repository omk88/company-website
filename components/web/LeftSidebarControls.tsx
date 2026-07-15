import { ArrowLeft } from "lucide-react";
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarFooter } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { IncrementBlogLikesDislikes } from "./IncrementBlogLikesDislikes";
import { Doc } from "@/convex/_generated/dataModel";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { preloadAuthQuery } from "@/lib/auth-server";

interface ViewTrackerProps {
  blog: Doc<"blogs">;
}

export async function LeftSidebarControls({ blog }: ViewTrackerProps) {

  const preloadedCommentCountPromise = preloadQuery(api.comments.getCommentNumber, { blogId: blog._id });
  const preloadedUserPromise = preloadAuthQuery(api.auth.getCurrentUser);
  const preloadedVoteStatePromise = preloadAuthQuery(api.blogs.getBlogVoteState, { blogId: blog._id });
  const preloadedFeaturedStatePromise = preloadAuthQuery(api.blogs.getBlogFeaturedState, { blogId: blog._id });

  const [preloadedCommentCount, preloadedUser, preloadedVoteState, preloadedFeaturedState] = await Promise.all([
    preloadedCommentCountPromise,
    preloadedUserPromise,
    preloadedVoteStatePromise,
    preloadedFeaturedStatePromise
  ]);


  return (
    <Sidebar className="!w-40 !top-16 !z-40">
      <SidebarHeader>
        <Link className={buttonVariants({variant: "ghost"})} href="/insights">
            <ArrowLeft className="size-4" />
            Back to blog
        </Link>
      </SidebarHeader>
      <div className="w-1/2 mx-auto">
        <Separator />
      </div>
      <SidebarContent>
        <IncrementBlogLikesDislikes 
          blog={blog}
          preloadedUser={preloadedUser}
          preloadedVoteState={preloadedVoteState}
          preloadedCommentCount={preloadedCommentCount}
          preloadedFeaturedState={preloadedFeaturedState} 
        />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}