import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { RxLinkedinLogo } from "react-icons/rx";
import { AiOutlineInstagram } from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";
import { MobileMenu } from "./MobileMenu";
import { NavbarAuthClient } from "./NavbarAuthClient";
import { Suspense } from "react";
import { getServerAuth } from "@/lib/auth-server";
import { Skeleton } from "../ui/skeleton";
import { NavLink } from "./NavLink";
import CreatePostButton from "./CreatePostButton";

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
  const anim = "relative no-underline hover:no-underline after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100";

  return (
    <header className="w-full fixed top-0 z-50 bg-background/95 backdrop-blur-sm border-b"> 
      <nav className="w-full px-12 h-16 flex items-center justify-between relative">
        <div className="flex items-center gap-8">
          <Link href="/">
            <h1 className="font-poppins text-xl font-bold tracking-tight text-foreground">
              TaQtiQ
            </h1>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <NavLink href="/" anim={anim}>Home</NavLink>
            <NavLink href="/vision" anim={anim}>Vision</NavLink>
            <NavLink href="/insights" anim={anim}>Insights</NavLink>
            <NavLink href="/contact" anim={anim}>Contact</NavLink>
            <NavLink href="/products" anim={anim}>Products</NavLink>
          </div>

          <div className="ml-4">
            <Suspense fallback={<div className="w-24 h-8" />}>
              <CreatePostButton />
            </Suspense>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-5 text-foreground">

          <div className="flex items-center gap-4 border-r border-border pr-4">
            <Link href="https://x.com/TaQtiQ_tech" target="_blank" rel="noopener noreferrer">
              <FaXTwitter className="h-4 w-4 transition-transform hover:scale-105 cursor-pointer opacity-80 hover:opacity-100" />
            </Link>
            
            <Link href="https://www.instagram.com/taqtiq_tech" target="_blank" rel="noopener noreferrer">
              <AiOutlineInstagram className="h-4.5 w-4.5 transition-transform hover:scale-105 cursor-pointer opacity-80 hover:opacity-100" />
            </Link>
            
            <Link href="https://www.linkedin.com/company/taqtiq-tech" target="_blank" rel="noopener noreferrer">
              <RxLinkedinLogo className="h-4.5 w-4.5 transition-transform hover:scale-105 cursor-pointer opacity-80 hover:opacity-100" />
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Suspense fallback={<AuthSkeleton />}>
              <NavbarAuthServer />
            </Suspense>
          </div>
        </div>

        <div className="flex md:hidden items-center gap-4">
          <ThemeToggle />
          <MobileMenu 
            anim={anim} 
            navbarAuth={ 
              <Suspense fallback={<AuthSkeleton />}>
                <NavbarAuthServer />
              </Suspense> 
            } 
          />
        </div>
      </nav>
    </header>
  );
}