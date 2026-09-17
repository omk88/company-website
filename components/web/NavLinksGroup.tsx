"use client";

import { useState } from "react";
import { LayoutGroup } from "framer-motion";
import { NavLink } from "./NavLink";
import NavbarResourcesDropdown from "./NavbarResourcesDropdown";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";

export function NavLinksGroup() {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  return (
    <div className="flex items-center">
      <div className="hidden md:flex">
        <LayoutGroup id="navbar-group">
          <div
            onMouseLeave={() => {
              setHoveredPath(null);
              setPendingPath(null);
            }}
            className="flex items-center gap-1 relative"
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
      </div>
      <div className="flex md:hidden">
        <Button>
          <Menu />
        </Button>
      </div>
    </div>
  );
}