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
                                <Link href={profileLink}>
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
                                </Link>
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