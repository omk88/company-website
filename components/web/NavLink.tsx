"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  hoveredPath: string | null;
  setHoveredPath: (path: string | null) => void;
}

function NavLinkInner({ href, children, hoveredPath, setHoveredPath }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const isHovered = hoveredPath === href;

  return (
    <Link
      href={href}
      onMouseEnter={() => setHoveredPath(href)}
      className="relative px-3 py-1.5 text-sm font-medium transition-colors text-foreground rounded-lg"
    >
      {isHovered && (
        <motion.div
          layoutId="navbar-hover-pill"
          className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 rounded-lg -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}

      {isActive && !isHovered && !hoveredPath && (
        <div className="absolute inset-0 bg-neutral-100/70 dark:bg-neutral-800/70 rounded-lg -z-10" />
      )}

      <span className="relative z-10">{children}</span>
    </Link>
  );
}

export function NavLink(props: NavLinkProps) {
  return (
    <Suspense
      fallback={
        <Link
          href={props.href}
          className="px-3 py-1.5 text-sm font-medium text-foreground rounded-lg"
        >
          {props.children}
        </Link>
      }
    >
      <NavLinkInner {...props} />
    </Suspense>
  );
}