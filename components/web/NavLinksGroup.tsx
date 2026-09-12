"use client";

import React, { useState } from "react";
import { LayoutGroup } from "framer-motion";
import { NavLink } from "./NavLink";
import NavbarResourcesDropdown from "./NavbarResourcesDropdown";

export function NavLinksGroup() {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  return (
    <LayoutGroup id="navbar-group">
      <div
        onMouseLeave={() => {
          setHoveredPath(null);
          setPendingPath(null);
        }}
        className="hidden md:flex items-center gap-1 relative"
      >
        <NavLink
          href="/"
          hoveredPath={hoveredPath}
          setHoveredPath={setHoveredPath}
          pendingPath={pendingPath}
          setPendingPath={setPendingPath}
        >
          Home
        </NavLink>

        <NavbarResourcesDropdown
          hoveredPath={hoveredPath}
          setHoveredPath={setHoveredPath}
        />

        <NavLink
          href="/insights"
          hoveredPath={hoveredPath}
          setHoveredPath={setHoveredPath}
          pendingPath={pendingPath}
          setPendingPath={setPendingPath}
        >
          Insights
        </NavLink>
      </div>
    </LayoutGroup>
  );
}