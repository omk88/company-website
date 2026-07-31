"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { LogOut, LogIn, ArrowUpRight, Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import { useState } from "react";

interface NavbarAuthClientProps {
    initialIsAuth: boolean;
    initialImage?: string | null;
}

export function NavbarAuthClient({ initialIsAuth, initialImage }: NavbarAuthClientProps) {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [open, setOpen] = useState(false);

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Signed out successfully");
                    router.push("/");
                    router.refresh();
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message || "Failed to sign out");
                }
            }
        });
    };

    const isLoggedIn = isPending ? initialIsAuth : !!session;
    const userData = useQuery(api.auth.getCurrentUser, isLoggedIn ? {} : "skip");
    
    const defaultAvatarUrl = "/default.svg";
    const profileUsername = userData?.profile?.username;
    
    const profileLink = profileUsername ? `/${profileUsername}` : "/profile";

    const clientSessionImage = session?.user?.image && !session.user.image.includes("googleusercontent.com")
        ? session.user.image
        : null;

    const avatarSrc = userData?.profile?.profilePicUrl || clientSessionImage || initialImage || defaultAvatarUrl;

    const firstName = userData?.profile?.firstName;
    const lastName = userData?.profile?.lastName;
    
    const displayName = (firstName && lastName) ? `${firstName} ${lastName}` : userData?.username;

    return (
        <TooltipProvider delayDuration={200}>
            <div className="flex items-center gap-2">
                {isLoggedIn ? (
                    <>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" align="center">
                                <p className="text-xs font-medium">Sign Out</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                            <Button variant="ghost" size="icon" className="cursor-pointer">
                                                <div className="h-5 w-5 rounded-full overflow-hidden border border-muted flex items-center justify-center bg-transparent">
                                                    <img
                                                        src={avatarSrc}
                                                        alt={profileUsername || "User Profile"}
                                                        loading="eager"
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            </Button>
                                    </PopoverTrigger>

                                    <PopoverContent 
                                        align="end" 
                                        className="w-80 p-1.5 shadow-lg rounded-xl border border-border bg-popover"
                                    >
                                        <Link
                                            href={`/${userData?.profile?.username || ""}`}
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
                                                    <span className="text-sm font-semibold truncate leading-tight">
                                                        {`${displayName}`}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground group-hover:text-accent-foreground/80 truncate mt-0.5">
                                                        @{userData?.profile?.username}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-accent-foreground shrink-0 pl-2">
                                                <span className="hidden sm:inline">View</span>
                                                <ArrowUpRight className="w-4 h-4 stroke-[2] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                            </div>
                                        </Link>

                                        <div className="w-full px-2">
                                            <Separator />
                                        </div>

                                        <div className="flex flex-col gap-0.5">
                                        <Link
                                            href={`/company/blog`}
                                            onClick={() => setOpen(false)}
                                            className="flex items-center text-muted-foreground gap-2.5 px-2.5 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors duration-100 cursor-pointer"
                                        >
                                            <Plus className="w-4 h-4 stroke-[2] shrink-0 group-hover:text-current" />
                                            <span>Create a post</span>
                                        </Link>

                                        <button 
                                            className="w-full flex items-center gap-2.5 px-2.5 py-2 text-sm font-medium rounded-md text-destructive hover:bg-destructive/10 transition-colors duration-100 cursor-pointer text-left"
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
                            <Link className={buttonVariants({ variant: "ghost", size: "icon" })} href="/sign-in">
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