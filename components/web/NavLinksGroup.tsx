"use client";

import React, { useState } from "react";
import { NavLink } from "./NavLink";
import NavbarResourcesDropdown from "./NavbarResourcesDropdown";

export function NavLinksGroup() {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  return (
    <div
      onMouseLeave={() => setHoveredPath(null)}
      className="hidden md:flex items-center gap-1 relative"
    >
      <NavLink
        href="/"
        hoveredPath={hoveredPath}
        setHoveredPath={setHoveredPath}
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
      >
        Insights
      </NavLink>
    </div>
  );
}