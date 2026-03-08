"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Bug,
  Coins,
  AppWindowMac,
  Layers,
} from "lucide-react";
import { LogoComponent } from "@/components/LogoComponent";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  {
    label: "Panel General",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Usuarios",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Suscripciones",
    href: "/admin/subscriptions",
    icon: CreditCard,
  },
  {
    label: "Créditos",
    href: "/admin/credits",
    icon: Coins,
  },
  {
    label: "Planes",
    href: "/admin/plans",
    icon: Layers,
  },
  {
    label: "Bug Reports",
    href: "/admin/bugs",
    icon: Bug,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <header
      className={cn(
        "bg-card flex flex-col transition-all duration-300 ease-in-out overflow-clip border-r border-border shrink-0",
        isOpen ? "w-64" : "w-17",
      )}
    >
      <div className="sticky top-0 h-screen w-full flex flex-col">
        {/* Top: logo + toggle */}
        <div className="h-16 flex items-center justify-start px-3.5 gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full shrink-0"
                  onClick={() => setIsOpen((o) => !o)}
                >
                  <AppWindowMac className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{isOpen ? "Colapsar" : "Expandir"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Link href="/admin">
            <LogoComponent
              className={cn(
                "text-xl transition-all duration-300 ease-in-out",
                isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
              )}
            />
          </Link>
        </div>

        {/* Navegación */}
        <nav className="flex flex-col gap-1 px-3 flex-1 mt-1">
          <TooltipProvider>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 overflow-clip",
                        isOpen ? "w-full" : "w-9",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span
                        className={cn(
                          "transition-opacity duration-300 whitespace-nowrap",
                          isOpen ? "opacity-100" : "opacity-0 sr-only",
                        )}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </TooltipTrigger>
                  {!isOpen && (
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </nav>

        {/* Footer */}
        <div className="px-2 py-4 border-t border-border">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/chat"
                  className={cn(
                    "flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150 overflow-clip",
                    isOpen ? "w-full" : "w-9",
                  )}
                >
                  <span className="text-base leading-none shrink-0">←</span>
                  <span
                    className={cn(
                      "transition-opacity duration-300 whitespace-nowrap",
                      isOpen ? "opacity-100" : "opacity-0 sr-only",
                    )}
                  >
                    Volver a la app
                  </span>
                </Link>
              </TooltipTrigger>
              {!isOpen && (
                <TooltipContent side="right">
                  <p>Volver a la app</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}
