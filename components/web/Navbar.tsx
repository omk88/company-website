"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "../ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { RxLinkedinLogo } from "react-icons/rx";
import { AiOutlineInstagram } from "react-icons/ai";


export function Navbar() {

    const router = useRouter();

    return (
        <nav className="w-full py-5 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <Link href="/">
                    <h1 className="text-3xl font-bold">
                        taQtiQ
                    </h1>
                </Link>

                <div className="flex items-center gap-10 ml-4">
                    <Link className={buttonVariants({ variant: "link" })} href="/">Home</Link>
                    <Link className={buttonVariants({ variant: "link" })} href="/about">About</Link>
                    <Link className={buttonVariants({ variant: "link" })} href="/insights">Insights</Link>
                    <Link className={buttonVariants({ variant: "link" })} href="/contact">Contact</Link>
                    <Link className={buttonVariants({ variant: "link" })} href="/products">Products</Link>
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