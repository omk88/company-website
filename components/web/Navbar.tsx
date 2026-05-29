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
        <div className="w-full pt-6 px-4 flex justify-center sticky top-0 z-50"> 
            
            <nav className="w-full max-w-6xl bg-white/30 backdrop-blur-xl rounded-full py-3 px-8 flex items-center justify-between 
                border border-white/60
                shadow-[0_10px_30px_rgba(0,0,0,0.04),inset_1px_1px_2px_rgba(255,255,255,0.8)]"
            >
                
                <div className="flex items-center gap-2.5">
                    <Link href="/">
                        <h1 className="font-poppins-text text-3xl font-extrabold text-neutral-950">
                            <span className="text-2.2xl">T</span>a<span className="text-3.5xl">Q</span>ti<span className="text-4xl">Q</span>
                        </h1>
                    </Link>

                    <div className="flex items-center gap-10 ml-4">
                        <Link className={cn(buttonVariants({ variant: "link" }), anim, "text-neutral-950 hover:opacity-70 font-bold")} href="/">Home</Link>
                        <Link className={cn(buttonVariants({ variant: "link" }), anim, "text-neutral-950 hover:opacity-70 font-bold")} href="/vision">The Vision</Link>
                        <Link className={cn(buttonVariants({ variant: "link" }), anim, "text-neutral-950 hover:opacity-70 font-bold")} href="/insights">Insights</Link>
                        <Link className={cn(buttonVariants({ variant: "link" }), anim, "text-neutral-950 hover:opacity-70 font-bold")} href="/contact">Contact</Link>
                        <Link className={cn(buttonVariants({ variant: "link" }), anim, "text-neutral-950 hover:opacity-70 font-bold")} href="/products">Products</Link>
                    </div>
                </div>

                <div className="flex items-center gap-5 ml-4 text-neutral-950">
                    <FaXTwitter className="h-5 w-5 transition-transform hover:scale-105 cursor-pointer" />
                    <AiOutlineInstagram className="h-5 w-5 transition-transform hover:scale-105 cursor-pointer" />
                    <RxLinkedinLogo className="h-5 w-5 transition-transform hover:scale-105 cursor-pointer" />
                    
                    <div className="flex items-center gap-1 ml-4">
                        <ThemeToggle />
                        <NavbarAuth initialIsAuth={userIsAuthenticated} />
                    </div>
                </div>
                
            </nav>
        </div>
    );
}