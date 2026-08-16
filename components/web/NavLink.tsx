"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  anim: string;
}

export function NavLink({ href, children, anim }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: "link" }),
        anim,
        "font-mono text-foreground hover:opacity-70 font-medium text-sm px-2",
        isActive && "after:scale-x-100 after:origin-bottom-left"
      )}
    >
      {children}
    </Link>
  );
}