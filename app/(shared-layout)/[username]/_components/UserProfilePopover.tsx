"use client";

import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { ArrowUpRight, Plus, Inbox, LogOut } from "lucide-react";

interface UserProfilePopoverProps {
  openProfile: boolean;
  setOpenProfile: (open: boolean) => void;
  avatarSrc: string;
  profileUsername?: string;
  profileDisplayName?: string;
  activeProfile: any;
  handleSignOut: () => void;
}

export function UserProfilePopover({
  openProfile,
  setOpenProfile,
  avatarSrc,
  profileUsername,
  profileDisplayName,
  activeProfile,
  handleSignOut,
}: UserProfilePopoverProps) {
  const closePopover = () => setOpenProfile(false);

  return (
    <Popover open={openProfile} onOpenChange={setOpenProfile}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`${buttonVariants({
            variant: "ghost",
            size: "icon",
          })} cursor-pointer h-9 w-9 rounded-lg shrink-0 flex items-center justify-center`}
        >
          <div className="size-6 md:size-5 rounded-full overflow-hidden border border-border bg-muted shrink-0 flex items-center justify-center">
            <img
              src={avatarSrc}
              alt={profileUsername || "User Profile"}
              loading="eager"
              decoding="sync"
              suppressHydrationWarning
              className="h-full w-full object-cover"
            />
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-80 p-1.5 rounded-xl border border-border bg-popover"
      >
        <Link
          href={`/${profileUsername || ""}`}
          onClick={closePopover}
          className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-accent hover:text-accent-foreground transition-colors duration-100 cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 border border-border rounded-full overflow-hidden bg-muted shrink-0">
              <img
                src={avatarSrc}
                alt="profile"
                className="h-full w-full object-cover"
                decoding="async"
              />
            </div>
            <div className="flex flex-col min-w-0">
              {activeProfile ? (
                <>
                  <span className="text-lg md:text-sm font-semibold truncate leading-tight">
                    {profileDisplayName}
                  </span>
                  <span className="text-base md:text-xs text-zinc-600 dark:text-zinc-400 group-hover:text-accent-foreground/80 truncate md:mt-0.5">
                    @{profileUsername}
                  </span>
                </>
              ) : (
                <div className="space-y-1 py-0.5">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-accent-foreground shrink-0 pl-2">
            <span className="hidden sm:inline">View</span>
            <ArrowUpRight className="size-5 md:size-4 stroke-[2.5] md:stroke-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
          </div>
        </Link>

        <div className="w-full px-2">
          <Separator />
        </div>

        <div className="flex flex-col gap-0.5">
          <Link
            href="/create-blog"
            onClick={closePopover}
            className="flex items-center text-zinc-600 dark:text-zinc-400 gap-2.5 px-2.5 py-2 text-xs rounded-md hover:bg-accent hover:text-accent-foreground transition-colors duration-100 cursor-pointer"
          >
            <Plus className="size-5 md:size-4 stroke-[2.5] md:stroke-2 text-foreground transition-all shrink-0" />
            <span className="md:text-sm text-base text-foreground">
              Create a Post
            </span>
          </Link>

          <Link
            href="/inbox"
            onClick={closePopover}
            className="flex items-center text-zinc-600 dark:text-zinc-400 gap-2.5 px-2.5 py-2 text-xs rounded-md hover:bg-accent hover:text-accent-foreground transition-colors duration-100 cursor-pointer"
          >
            <Inbox className="size-5 md:size-4 stroke-[2.5] md:stroke-2 text-foreground transition-all shrink-0" />
            <span className="md:text-sm text-base text-foreground">Inbox</span>
          </Link>

          <button
            type="button"
            className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs rounded-md text-destructive hover:bg-destructive/10 transition-colors duration-100 cursor-pointer text-left"
            onClick={() => {
              closePopover();
              handleSignOut();
            }}
          >
            <LogOut className="text-red-600 size-5 md:size-4 stroke-[2.5] md:stroke-2 text-foreground transition-all shrink-0" />
            <span className="md:text-sm text-base">Sign Out</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}