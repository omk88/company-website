"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "../ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { RxLinkedinLogo } from "react-icons/rx";
import { AiOutlineInstagram } from "react-icons/ai";
import { cn } from "@/lib/utils";
import Image from 'next/image';


export function Navbar() {

    const router = useRouter();
    const anim = "relative no-underline hover:no-underline after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100";

    return (
        <nav className="w-full py-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
                <Image
                    src={"https://i.ibb.co/JRXCHVWB/logo3.png"}
                    alt="image"
                    width="50"
                    height="50"
                />
                <Link href="/">
                    <h1 className="text-3xl font-bold">
                        taQtiQ
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
                <AiOutlineInstagram className="h-8 w-8" />
                <RxLinkedinLogo className="h-8 w-8" />
                <ThemeToggle />
            </div>
        </nav>
    );
}