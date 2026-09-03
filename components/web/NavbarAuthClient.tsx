"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { LogOut, LogIn, ArrowUpRight, Plus, Bell, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useState, useRef, useMemo } from "react";
import { useCurrentUser } from "@/app/ConvexClientProvider";
import BlogNotificationCard from "./BlogNotificationCard";
import { useMutation, usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface NavbarAuthClientProps {
  initialIsAuth: boolean;
  initialImage?: string | null;
  initialProfile?: {
    username?: string;
    displayName?: string;
  } | null;
}

const getCategory = (dateString: string | number) => {
  const date = new Date(dateString);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";
  return "Older";
};

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

  const hadUnreadOnOpen = useRef(false);

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
  const userId = userData?.profile?.userId;

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

  const markNotificationsAsRead = useMutation(api.notifications.markNotificationsAsRead);

  const { results: notificationsList, status, loadMore, isLoading } = usePaginatedQuery(
    api.notifications.getNotifications,
    userId ? { userId } : "skip",
    { initialNumItems: 10 }
  );

  const groupedNotifications = useMemo(() => {
    const groups: { Today: typeof notificationsList; Yesterday: typeof notificationsList; Older: typeof notificationsList } = {
      Today: [],
      Yesterday: [],
      Older: [],
    };

    if (notificationsList) {
      notificationsList.forEach((blog) => {
        const category = getCategory(blog.createdAt);
        groups[category].push(blog);
      });
    }

    return groups;
  }, [notificationsList]);

  const unreadCount = notificationsList ? notificationsList.filter((item) => item.isUnread).length : 0;
  const [showBadge, setShowBadge] = useState(unreadCount > 0);

  useEffect(() => {
    if (!openNotifications) {
      if (unreadCount > 0) {
        setShowBadge(true);
      } else {
        const timer = setTimeout(() => setShowBadge(false), 200);
        return () => clearTimeout(timer);
      }
    }
  }, [unreadCount, openNotifications]);

  const handleOpenNotifications = (open: boolean) => {
    setOpenNotifications(open);

    if (open) {
      if (unreadCount > 0) {
        hadUnreadOnOpen.current = true;
      }
    } else {
      if (userId && hadUnreadOnOpen.current) {
        markNotificationsAsRead({ userId });
        hadUnreadOnOpen.current = false;
      }
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
                      <Bell className="h-4 w-4 text-foreground transition-all" />
                      
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
                      <Bell className="h-4 w-4 text-foreground transition-all" />
                      <span className="font-medium">Notifications</span>
                      
                      {unreadCount > 0 && (
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-semibold text-white leading-none">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </div>

                    <Separator className="mb-1" />

                    <div className="flex flex-col gap-2 max-h-80 overflow-y-auto p-1">
                      {notificationsList && notificationsList.length > 0 ? (
                        <>
                          {(["Today", "Yesterday", "Older"] as const).map((category) => {
                            const items = groupedNotifications[category];
                            if (!items || items.length === 0) return null;

                            return (
                              <div key={category} className="flex flex-col gap-1.5">
                                <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 px-2 pt-1 tracking-wider">
                                  {category}
                                </span>
                                {items.map((blog) => (
                                  <BlogNotificationCard
                                    key={blog._id}
                                    _id={blog._id}
                                    title={blog.title}
                                    imageUrl={blog.imageUrl}
                                    createdAt={blog.createdAt}
                                    author={blog.author}
                                    isUnread={blog.isUnread}
                                  />
                                ))}
                              </div>
                            );
                          })}

                          {status === "CanLoadMore" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full text-xs text-muted-foreground mt-1"
                              onClick={() => loadMore(5)}
                            >
                              Load earlier posts
                            </Button>
                          )}

                          {status === "LoadingMore" && (
                            <div className="flex justify-center p-2">
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                          )}
                        </>
                      ) : isLoading ? (
                        <div className="p-4 text-center text-xs text-zinc-500">
                          Loading...
                        </div>
                      ) : (
                        <div className="p-4 text-center text-xs text-zinc-500">
                          No notifications yet
                        </div>
                      )}
                    </div>
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