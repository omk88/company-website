"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { LogIn, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

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

    return (
        <div className="flex items-center gap-3">
            {isLoggedIn ? (
                <Button variant="ghost" size="icon" className="w-9 h-9" onClick={handleSignOut} title="Sign Out">
                    <LogOut className="h-4 w-4" />
                </Button>
            ) : (
                <Link className={cn(buttonVariants({ variant: "ghost" }), "w-9 h-9 flex items-center justify-center")} href="/sign-in" title="Sign Up">
                    <LogIn className="h-4 w-4" />
                </Link>
            )}
        </div>
    );
}