import { ArrowLeft, ArrowRightLeft } from "lucide-react";
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarFooter } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { IncrementBlogLikesDislikes } from "./IncrementBlogLikesDislikes";
import { Id } from "@/convex/_generated/dataModel";

interface ViewTrackerProps {
  postId: Id<"blogs">;
  storageId: string;
  likes: number;
  dislikes: number;
  comments: number;
}

export function LeftSidebarControls({ postId, storageId, likes, dislikes, comments }: ViewTrackerProps) {
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
        <IncrementBlogLikesDislikes postId={postId} storageId={storageId} likes={likes} dislikes={dislikes} comments={comments} />
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}