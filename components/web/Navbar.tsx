import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";
import { NavbarAuthClient } from "./NavbarAuthClient";
import { Suspense } from "react";
import { getServerAuth } from "@/lib/auth-server";
import { Skeleton } from "../ui/skeleton";
import CreatePostButton from "./CreatePostButton";
import { NavLinksGroup } from "./NavLinksGroup";

async function NavbarAuthServer() {
  const { isAuth, initialImage, initialProfile } = await getServerAuth();

  return (
    <NavbarAuthClient
      initialIsAuth={isAuth}
      initialImage={initialImage}
      initialProfile={initialProfile}
    />
  );
}

function AuthSkeleton() {
  return <Skeleton className="h-9 w-9 rounded-lg shrink-0" />;
}

export function Navbar() {

  return (
    <header className="w-full fixed top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <nav className="w-full px-4 md:px-12 h-10 md:h-16 flex items-center justify-between relative">
        <div className="flex items-center gap-8">
          <Link href="/">
            <h1 className="font-poppins text-2xl md:text-xl font-bold tracking-tight text-foreground">
              TaQtiQ
            </h1>
          </Link>

          <NavLinksGroup />

          <div className="hidden md:flex ml-2">
            <Suspense fallback={<div className="w-24 h-8" />}>
              <CreatePostButton />
            </Suspense>
          </div>
        </div>

        <div className="items-center gap-5 text-foreground">
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Suspense fallback={<AuthSkeleton />}>
              <NavbarAuthServer />
            </Suspense>
          </div>
        </div>
      </nav>
    </header>
  );
}