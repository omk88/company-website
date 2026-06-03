import { isAuthenticated } from "@/lib/auth-server";
import { NavbarAuthClient } from "./NavbarAuthClient";
import { Suspense } from "react";
import { LogIn } from "lucide-react";

async function NavbarAuthServerContent() {
  const userIsAuthenticated = await isAuthenticated();
  return <NavbarAuthClient initialIsAuth={userIsAuthenticated} />;
}

export function NavbarAuth() {
  return (
    <Suspense fallback={<LogIn className="h-4 w-4" />}>
      <NavbarAuthServerContent />
    </Suspense>
  );
}