import { ArrowLeft, ArrowRightLeft } from "lucide-react";
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarFooter } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { IncrementBlogLikesDislikes } from "./IncrementBlogLikesDislikes";
import { Doc } from "@/convex/_generated/dataModel";

interface ViewTrackerProps {
  post: Doc<"blogs">;
}

export function LeftSidebarControls({ post }: ViewTrackerProps) {
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
        <IncrementBlogLikesDislikes post={post} />
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}