import { ArrowLeft, ArrowRightLeft } from "lucide-react";
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarFooter } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { IncrementLikesDislikes } from "./IncrementLikesDislikes";
import { Id } from "@/convex/_generated/dataModel";

interface ViewTrackerProps {
  postId: Id<"blogs">;
}

export function LeftSidebarControls({ postId }: ViewTrackerProps) {
  return (
    <Sidebar className="!w-40 !top-16 !z-40">
      <SidebarHeader>
        <Link className={buttonVariants({variant: "ghost"})} href="/insights">
            <ArrowLeft className="size-4" />
            Back to blog
        </Link>
      </SidebarHeader>
      <Separator/>
      <SidebarContent>
        <IncrementLikesDislikes postId={postId} />
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}