"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { LogOut, LogIn, ArrowUpRight, Plus, Bell, Library, MessageSquare, MessageSquareText } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/app/ConvexClientProvider";
import BlogNotificationCard from "./BlogNotificationCard";
import CommentNotificationCard from "./CommentNotificationCard";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface NavbarAuthClientProps {
  initialIsAuth: boolean;
  initialImage?: string | null;
  initialProfile?: {
    username?: string;
    displayName?: string;
  } | null;
}

export function NavbarAuthClient({ 
  initialIsAuth, 
  initialImage, 
  initialProfile 
}: NavbarAuthClientProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [openProfile, setOpenProfile] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSignOut = async () => {
    setOpenProfile(false);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed out successfully");
          router.push("/");
          router.refresh();
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Failed to sign out");
        },
      },
    });
  };

  const isLoggedIn = isMounted ? !!session : initialIsAuth;
  const userData = useCurrentUser();
  const profileId = userData?.profile?._id;

  const activeProfile = userData?.profile ?? initialProfile;
  const profileUsername = activeProfile?.username;
  const profileDisplayName = activeProfile?.displayName || profileUsername;

  const defaultAvatarUrl = "/default.svg";

  const clientSessionImage =
    session?.user?.image && !session.user.image.includes("googleusercontent.com")
      ? session.user.image
      : null;

  const avatarSrc = isMounted
    ? userData?.profile?.profilePicUrl || clientSessionImage || initialImage || defaultAvatarUrl
    : initialImage || defaultAvatarUrl;


  const markAsRead = useMutation(api.notifications.markNotificationsAsRead);

  const notificationData = useQuery(
    api.notifications.getUnreadPosts,
    profileId ? { profileId } : "skip"
  );

  const unreadCount = notificationData?.count ?? 0;
  const unreadNotifications = notificationData?.notifications ?? [];

  const [hasUnread, setHasUnread] = useState(unreadCount > 0);
  const [showBadge, setShowBadge] = useState(unreadCount > 0);

  useEffect(() => {
    if (!openNotifications) {
      if (unreadCount > 0) {
        setHasUnread(true);
        setShowBadge(true);
      } else {
        setHasUnread(false);
        const timer = setTimeout(() => setShowBadge(false), 200);
        return () => clearTimeout(timer);
      }
    }
  }, [unreadCount, openNotifications]);

  const handleOpenNotifications = (open: boolean) => {
    setOpenNotifications(open);
    if (!open && profileId && unreadCount > 0) {
      markAsRead({ profileId });
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-2 shrink-0">
        {isLoggedIn ? (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Popover open={openNotifications} onOpenChange={handleOpenNotifications}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-9 h-9 relative flex items-center justify-center cursor-pointer"
                    >
                      <Bell className="h-4 w-4 text-foreground transition-all block dark:hidden" />
                      
                      {showBadge && (
                        <span
                          data-state={unreadCount > 0 ? "open" : "closed"}
                          className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 transition-all duration-200 ease-in-out data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-50 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-0"
                        />
                      )}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    align="end"
                    className="w-80 p-1.5 rounded-xl border border-border bg-popover"
                  >
                    <div className="flex flex-row gap-2 items-center text-sm px-2 pt-2 pb-1.5">
                      <Bell className="h-4 w-4 text-foreground transition-all block dark:hidden" />
                      <span className="font-medium">Notifications</span>
                      
                      {unreadCount > 0 && (
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-semibold text-white leading-none">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </div>

                    <Separator />

                    <span className="text-xs font-semibold px-2">Today</span>

                    <div className="flex flex-row gap-2 items-center text-xs font-roboto text-zinc-600 dark:text-zinc-400 capitalize px-2">
                        <div className="h-5 w-5 rounded-full overflow-hidden border border-border bg-muted shrink-0 flex items-center justify-center">
                            <img
                              src={"/comp1.png"}
                              alt={"User Profile"}
                              loading="eager"
                              decoding="sync"
                              suppressHydrationWarning
                              className="h-full w-full object-cover"
                            />
                        </div>

                        <span>info added 3 insights</span>

                        <Library className="h-4 w-4 ml-auto" />
                    </div>

                    <div className="flex flex-col gap-2 max-h-80 overflow-y-auto p-1">
                      {unreadNotifications.length > 0 ? (
                        unreadNotifications.map((blog) => (
                          <BlogNotificationCard
                            key={blog._id}
                            _id={blog._id}
                            title={blog.title}
                            imageUrl={blog.imageUrl}
                            createdAt={blog.createdAt}
                            author={blog.author}
                          />
                        ))
                      ) : (
                        <div className="p-4 text-center text-xs text-zinc-500">
                          No unread posts
                        </div>
                      )}
                    </div>

                    <div className="flex flex-row gap-2 items-center text-xs font-roboto text-zinc-600 dark:text-zinc-400 capitalize px-2">
                      <div className="h-5 w-5 rounded-full overflow-hidden border border-border bg-muted shrink-0 flex items-center justify-center">
                          <img
                            src={"/comp1.png"}
                            alt={"User Profile"}
                            loading="eager"
                            decoding="sync"
                            suppressHydrationWarning
                            className="h-full w-full object-cover"
                          />
                      </div>

                      <span>omk98 added 1 comment to your post</span>

                      <MessageSquareText className="h-4 w-4 ml-auto" />
                    </div>
                    <CommentNotificationCard />
                  </PopoverContent>
                </Popover>
              </TooltipTrigger>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Popover open={openProfile} onOpenChange={setOpenProfile}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={`${buttonVariants({ variant: "ghost", size: "icon" })} cursor-pointer h-9 w-9 rounded-lg shrink-0 flex items-center justify-center`}
                    >
                      <div className="h-5 w-5 rounded-full overflow-hidden border border-border bg-muted shrink-0 flex items-center justify-center">
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
                      onClick={() => setOpenProfile(false)}
                      className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors duration-100 cursor-pointer"
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
                              <span className="text-sm font-semibold truncate leading-tight">
                                {profileDisplayName}
                              </span>
                              <span className="text-xs text-zinc-600 dark:text-zinc-400 group-hover:text-accent-foreground/80 truncate mt-0.5">
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
                        <ArrowUpRight className="w-4 h-4 stroke-[2] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </Link>

                    <div className="w-full px-2">
                      <Separator />
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <Link
                        href="/create-blog"
                        onClick={() => setOpenProfile(false)}
                        className="flex items-center text-zinc-600 dark:text-zinc-400 gap-2.5 px-2.5 py-2 text-xs rounded-md hover:bg-accent hover:text-accent-foreground transition-colors duration-100 cursor-pointer"
                      >
                        <Plus className="w-4 h-4 stroke-[2] shrink-0 group-hover:text-current" />
                        <span>Create a post</span>
                      </Link>

                      <button
                        type="button"
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs rounded-md text-destructive hover:bg-destructive/10 transition-colors duration-100 cursor-pointer text-left"
                        onClick={handleSignOut}
                      >
                        <LogOut className="w-4 h-4 stroke-[2] shrink-0" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center">
                <p className="text-xs font-medium">Profile</p>
              </TooltipContent>
            </Tooltip>
          </>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                className={`${buttonVariants({ variant: "ghost", size: "icon" })} cursor-pointer h-9 w-9 shrink-0`}
                href="/sign-in"
              >
                <LogIn className="h-4 w-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              <p className="text-xs font-medium">Sign In</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}