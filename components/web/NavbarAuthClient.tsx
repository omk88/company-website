"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { LogOut, LogIn } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface NavbarAuthClientProps {
    initialIsAuth: boolean;
    initialImage?: string | null;
}

export function NavbarAuthClient({ initialIsAuth, initialImage }: NavbarAuthClientProps) {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

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
                                    <Popover>
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
                                            className="w-[var(--radix-popover-trigger-width)] min-w-[8rem] p-0"
                                        >
                                            <div className="flex flex-row items-center gap-2 w-full p-2">
                                                <div className="h-12 w-12 border-2 border-muted rounded-full overflow-hidden bg-muted relative shrink-0">
                                                    <img
                                                        src={avatarSrc}
                                                        alt="profile"
                                                        className="h-full w-full object-cover rounded-full"
                                                        decoding="async" 
                                                    />
                                                </div>

                                                <div className="relative w-full">
                                                    <div className="flex flex-col">
                                                        <h4 className="text-base font-semibold leading-none">{`${displayName}`}</h4>
                                                        <p className="text-sm text-muted-foreground leading-none mt-1">{`@${userData?.profile?.username}`}</p>
                                                    </div>
                                                </div>
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