"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarFooter } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { buttonVariants } from "../ui/button";
import { IncrementBlogLikesDislikes } from "./IncrementBlogLikesDislikes";
import { Doc } from "@/convex/_generated/dataModel";

interface LeftSidebarControlsProps {
  blog: Doc<"blogs">;
}

export function LeftSidebarControls({ blog }: LeftSidebarControlsProps) {
  return (
    <Sidebar bgClass="bg-white" showBorder={false} className="!w-40 !top-16 !z-40">
      <SidebarHeader>
        <Link className={buttonVariants({ variant: "ghost" })} href="/insights">
          <ArrowLeft className="size-4" />
          Back to blog
        </Link>
      </SidebarHeader>

      <div className="w-1/2 mx-auto">
        <Separator />
      </div>

      <SidebarContent>
        <IncrementBlogLikesDislikes blog={blog} />
        <SidebarGroup />
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}