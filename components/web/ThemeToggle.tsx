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
      className="w-9 h-9 relative flex items-center justify-center"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title="Toggle theme"
    >

      <Moon className="h-4 w-4 text-foreground transition-all block dark:hidden" />

      <Sun className="h-4 w-4 text-foreground transition-all hidden dark:block" />
    </Button>
  );
}