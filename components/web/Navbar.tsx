import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { RxLinkedinLogo } from "react-icons/rx";
import { AiOutlineInstagram } from "react-icons/ai";
import { cn } from "@/lib/utils";
import { FaXTwitter } from "react-icons/fa6";
import { MobileMenu } from "./MobileMenu";
import { NavbarAuthClient } from "./NavbarAuthClient";

interface NavBarProps {
    isAuth: boolean;
}

export function Navbar({ isAuth }: NavBarProps) { 
    const anim = "relative no-underline hover:no-underline after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100";

    return (
        <header className="w-full fixed top-0 left-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border transition-colors duration-300 ease-in-out"> 
            <nav className="w-full px-6 md:px-12 h-16 flex items-center justify-between relative">
                
                <div className="flex items-center gap-8">
                    <Link href="/">
                        <h1 className="font-poppins-text text-3xl font-extrabold text-foreground tracking-tight">
                            <span className="text-2.2xl">T</span>a<span className="text-3.5xl">Q</span>ti<span className="text-4xl">Q</span>
                        </h1>
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        <Link className={cn(buttonVariants({ variant: "link" }), anim, "text-foreground hover:opacity-70 font-semibold text-sm")} href="/">Home</Link>
                        <Link className={cn(buttonVariants({ variant: "link" }), anim, "text-foreground hover:opacity-70 font-semibold text-sm")} href="/vision">Vision</Link>
                        <Link className={cn(buttonVariants({ variant: "link" }), anim, "text-foreground hover:opacity-70 font-semibold text-sm")} href="/insights">Insights</Link>
                        <Link className={cn(buttonVariants({ variant: "link" }), anim, "text-foreground hover:opacity-70 font-semibold text-sm")} href="/contact">Contact</Link>
                        <Link className={cn(buttonVariants({ variant: "link" }), anim, "text-foreground hover:opacity-70 font-semibold text-sm")} href="/products">Products</Link>
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
                        <NavbarAuthClient initialIsAuth={isAuth} /> 
                    </div>
                </div>

                <div className="flex md:hidden items-center gap-4">
                    <ThemeToggle />
                    <MobileMenu anim={anim} navbarAuth={ <NavbarAuthClient initialIsAuth={isAuth} /> } />
                </div>
                
            </nav>
        </header>
    );
}