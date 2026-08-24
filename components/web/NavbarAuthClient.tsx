"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { buttonVariants } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { LogOut, LogIn, ArrowUpRight, Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/app/ConvexClientProvider";

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
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSignOut = async () => {
    setOpen(false);
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

  return (
    <TooltipProvider delayDuration={200}>
      <div className="h-9 w-9 flex items-center justify-center shrink-0">
        {isLoggedIn ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Popover open={open} onOpenChange={setOpen}>
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
                    onClick={() => setOpen(false)}
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
                      href="/company/blog"
                      onClick={() => setOpen(false)}
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