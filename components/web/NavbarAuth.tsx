import { isAuthenticated } from "@/lib/auth-server";
import { NavbarAuthClient } from "./NavbarAuthClient";
import { Suspense } from "react";
import { LogIn } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

async function NavbarAuthServerContent() {
  const userIsAuthenticated = await isAuthenticated();
  return <NavbarAuthClient initialIsAuth={userIsAuthenticated} />;
}

export function NavbarAuth() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center gap-3">
          <div className={cn(buttonVariants({ variant: "ghost" }), "w-9 h-9 flex items-center justify-center text-foreground")}>
            <LogIn className="h-4 w-4" />
          </div>
        </div>
      }
    >
      <NavbarAuthServerContent />
    </Suspense>
  );
}