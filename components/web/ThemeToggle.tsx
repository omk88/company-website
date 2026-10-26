"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "../ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-9 md:size-9 relative flex items-center justify-center cursor-pointer"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Moon className="size-5 md:size-4 stroke-[2.5] md:stroke-2 text-foreground transition-all block dark:hidden" />
      <Sun className="size-5 md:size-4 stroke-[2.5] md:stroke-2 text-foreground transition-all hidden dark:block" />
    </Button>
  );
}