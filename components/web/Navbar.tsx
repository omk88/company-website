import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { RxLinkedinLogo } from "react-icons/rx";
import { AiOutlineInstagram } from "react-icons/ai";
import { cn } from "@/lib/utils";
import { FaXTwitter } from "react-icons/fa6";
import { NavbarAuth } from "./NavbarAuth";
import { isAuthenticated } from "@/lib/auth-server"; 

export async function Navbar() { 
    const anim = "relative no-underline hover:no-underline after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100";

    const userIsAuthenticated = await isAuthenticated();

    return (
        <nav className="w-full py-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
                <Link href="/">
                    <h1 className="text-3xl font-bold">
                        <span className="text-2.2xl">T</span>a<span className="text-3.5xl">Q</span>ti<span className="text-4xl">Q</span>
                    </h1>
                </Link>

                <div className="flex items-center gap-10 ml-4">
                    <Link className={cn(buttonVariants({ variant: "link" }), anim)} href="/">Home</Link>
                    <Link className={cn(buttonVariants({ variant: "link" }), anim)} href="/about">About</Link>
                    <Link className={cn(buttonVariants({ variant: "link" }), anim)} href="/insights">Insights</Link>
                    <Link className={cn(buttonVariants({ variant: "link" }), anim)} href="/contact">Contact</Link>
                    <Link className={cn(buttonVariants({ variant: "link" }), anim)} href="/products">Products</Link>
                </div>
            </div>

            <div className="flex items-center gap-5 ml-4">
                <FaXTwitter className="h-8 w-8" />
                <AiOutlineInstagram className="h-8 w-8" />
                <RxLinkedinLogo className="h-8 w-8" />
                <div className="flex items-center gap-1 ml-4">
                    <ThemeToggle />
                    <NavbarAuth initialIsAuth={userIsAuthenticated} />
                </div>
            </div>
        </nav>
    );
}