"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { FaXTwitter } from "react-icons/fa6";
import { AiOutlineInstagram } from "react-icons/ai";
import { RxLinkedinLogo } from "react-icons/rx";
import { Menu, X } from "lucide-react";

interface MobileMenuProps {
  anim: string;
  navbarAuth: React.ReactNode;
}

export function MobileMenu({ anim, navbarAuth }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-foreground hover:opacity-70 focus:outline-none p-1 block md:hidden"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 w-full border-t border-b border-border bg-background animate-in fade-in slide-in-from-top-4 duration-200 z-50 md:hidden">
          <div className="px-6 py-4 flex flex-col gap-4">
            <div className="flex flex-col gap-3 items-start">
              <Link onClick={() => setIsOpen(false)} className={cn(buttonVariants({ variant: "link" }), anim, "text-foreground font-semibold text-base px-0")} href="/">Home</Link>
              <Link onClick={() => setIsOpen(false)} className={cn(buttonVariants({ variant: "link" }), anim, "text-foreground font-semibold text-base px-0")} href="/vision">Vision</Link>
              <Link onClick={() => setIsOpen(false)} className={cn(buttonVariants({ variant: "link" }), anim, "text-foreground font-semibold text-base px-0")} href="/insights">Insights</Link>
              <Link onClick={() => setIsOpen(false)} className={cn(buttonVariants({ variant: "link" }), anim, "text-foreground font-semibold text-base px-0")} href="/contact">Contact</Link>
              <Link onClick={() => setIsOpen(false)} className={cn(buttonVariants({ variant: "link" }), anim, "text-foreground font-semibold text-base px-0")} href="/products">Products</Link>
            </div>

            <hr className="border-border w-full" />

            <div className="flex items-center justify-between w-full pt-1">
              <div className="flex items-center gap-5 text-foreground">
                <FaXTwitter className="h-5 w-5 opacity-80" />
                <AiOutlineInstagram className="h-5.5 w-5.5 opacity-80" />
                <RxLinkedinLogo className="h-5.5 w-5.5 opacity-80" />
              </div>
              <div onClick={() => setIsOpen(false)}>
                {navbarAuth}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}