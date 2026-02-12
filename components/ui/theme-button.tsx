"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ThemeButtonProps {
  isCollapsed?: boolean;
}

export function ThemeButton({ isCollapsed = false }: ThemeButtonProps) {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn("h-9 overflow-clip", isCollapsed ? "w-9" : "w-full")}
        >
          {/* Icon only when collapsed */}
          <Sun
            className={cn(
              "h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90",
              isCollapsed ? "" : "hidden",
            )}
          />
          <Moon
            className={cn(
              "absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0",
              isCollapsed ? "" : "hidden",
            )}
          />

          {/* Full content when expanded */}
          <span
            className={cn(
              isCollapsed ? "opacity-0 sr-only" : "opacity-100",
              "w-full transition-opacity duration-600 flex flex-row items-center gap-2",
            )}
          >
            <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute left-7 size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span>Tema</span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[260px]" align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Claro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Oscuro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
