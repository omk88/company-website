import { ArrowLeft } from "lucide-react";
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarFooter } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { IncrementBlogLikesDislikes } from "./IncrementBlogLikesDislikes";
import { Doc } from "@/convex/_generated/dataModel";
import { preloadedQueryResult, preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { preloadAuthQuery } from "@/lib/auth-server";

interface ViewTrackerProps {
  post: Doc<"blogs">;
}

export async function LeftSidebarControls({ post }: ViewTrackerProps) {

  const preloadedCommentCount = await preloadQuery(api.comments.getCommentNumber, { postId: post._id });
  const preloadedCommentCountData = preloadedQueryResult(preloadedCommentCount);

  const preloadedUserPromise = preloadAuthQuery(api.auth.getCurrentUser);
  const preloadedVoteStatePromise = preloadAuthQuery(api.blogs.getBlogVoteState, { blogId: post._id });

  const [preloadedUser, preloadedVoteState] = await Promise.all([
    preloadedUserPromise,
    preloadedVoteStatePromise,
  ]);

  const preloadedUserData = preloadedQueryResult(preloadedUser);
  const preloadedVoteStateData = preloadedQueryResult(preloadedVoteState);


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
        <IncrementBlogLikesDislikes post={post} preloadedVoteStateData={preloadedVoteStateData} preloadedCommentCountData={preloadedCommentCountData} preloadedUserData={preloadedUserData} />
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}