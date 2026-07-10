"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { LogIn, LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Avatar, AvatarImage } from "../ui/avatar";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface NavbarAuthClientProps {
    initialIsAuth: boolean;
}

export function NavbarAuthClient({ initialIsAuth }: NavbarAuthClientProps) {
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
                                <Link href={"/"+userData?.profile?.username}>
                                    <Button variant="ghost" size="icon">
                                        <Avatar className="h-5 w-5 border-1 border-muted">
                                            <AvatarImage 
                                                src={userData?.profile?.profilePicUrl || defaultAvatarUrl} 
                                                alt={userData?.profile?.username || "User Profile"} 
                                            />
                                        </Avatar>
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