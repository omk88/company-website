import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { RxLinkedinLogo } from "react-icons/rx";
import { AiOutlineInstagram } from "react-icons/ai";
import { cn } from "@/lib/utils";
import { FaXTwitter } from "react-icons/fa6";
import { NavbarAuth } from "./NavbarAuth"; 

export function Navbar() { 
    const anim = "relative no-underline hover:no-underline after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100";

    return (
        <header className="w-full bg-background sticky top-0 z-50 transition-colors duration-300 ease-in-out"> 
            <nav className="w-full max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/">
                        <h1 className="font-poppins-text text-3xl font-extrabold text-foreground tracking-tight">
                            <span className="text-2.2xl">T</span>a<span className="text-3.5xl">Q</span>ti<span className="text-4xl">Q</span>
                        </h1>
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link className={cn(buttonVariants({ variant: "link" }), anim, "text-foreground hover:opacity-70 font-semibold text-sm")} href="/">Home</Link>
                        <Link className={cn(buttonVariants({ variant: "link" }), anim, "text-foreground hover:opacity-70 font-semibold text-sm")} href="/vision">Vision</Link>
                        <Link className={cn(buttonVariants({ variant: "link" }), anim, "text-foreground hover:opacity-70 font-semibold text-sm")} href="/insights">Insights</Link>
                        <Link className={cn(buttonVariants({ variant: "link" }), anim, "text-foreground hover:opacity-70 font-semibold text-sm")} href="/contact">Contact</Link>
                        <Link className={cn(buttonVariants({ variant: "link" }), anim, "text-foreground hover:opacity-70 font-semibold text-sm")} href="/products">Products</Link>
                    </div>
                </div>

                <div className="flex items-center gap-5 text-foreground">
                    <div className="flex items-center gap-4 border-r border-border pr-4">
                        <FaXTwitter className="h-4 w-4 transition-transform hover:scale-105 cursor-pointer opacity-80 hover:opacity-100" />
                        <AiOutlineInstagram className="h-4.5 w-4.5 transition-transform hover:scale-105 cursor-pointer opacity-80 hover:opacity-100" />
                        <RxLinkedinLogo className="h-4.5 w-4.5 transition-transform hover:scale-105 cursor-pointer opacity-80 hover:opacity-100" />
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <NavbarAuth /> 
                    </div>
                </div>
            </nav>
        </header>
    );
}