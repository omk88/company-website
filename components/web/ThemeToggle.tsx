"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 relative flex items-center justify-center cursor-pointer"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Moon className="h-4 w-4 text-foreground transition-all block dark:hidden" />
            <Sun className="h-4 w-4 text-foreground transition-all hidden dark:block" />
          </Button>
        </TooltipTrigger>
        
        <TooltipContent side="bottom" align="center">
          <p className="text-xs font-medium">Toggle theme</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}