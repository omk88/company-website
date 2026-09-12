"use client";

import React, { Suspense, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  hoveredPath: string | null;
  setHoveredPath: (path: string | null) => void;
  pendingPath: string | null;
  setPendingPath: (path: string | null) => void;
}

function NavLinkInner({
  href,
  children,
  hoveredPath,
  setHoveredPath,
  pendingPath,
  setPendingPath,
}: NavLinkProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === pendingPath) {
      setPendingPath(null);
    }
  }, [pathname, pendingPath, setPendingPath]);
  
  const isHovered = hoveredPath === href;
  const isPending = pendingPath === href;
  const isActive = pathname === href && !hoveredPath && !pendingPath;

  const showPill = isHovered || isPending || isActive;

  return (
    <Link
      href={href}
      onMouseEnter={() => setHoveredPath(href)}
      onClick={() => setPendingPath(href)}
      className="relative px-3 py-1.5 text-sm font-medium transition-colors text-foreground rounded-lg"
    >
      {showPill && (
        <motion.div
          layoutId="navbar-pill"
          className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 rounded-lg -z-10"
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 30,
          }}
        />
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