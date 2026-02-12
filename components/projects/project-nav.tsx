"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface ProjectNavProps {
  projectId: string;
}

const navItems = [
  {
    name: "Chat",
    href: "",
    exact: true,
  },
  {
    name: "Resumen",
    href: "/overview",
  },
  {
    name: "Tareas",
    href: "/tasks",
  },
  {
    name: "Recursos",
    href: "/resources",
  },
];

export function ProjectNav({ projectId }: ProjectNavProps) {
  const pathname = usePathname();
  const baseUrl = `/chat/proyectos/${projectId}`;

  return (
    <div className="hidden md:block border-b bg-background/95 backdrop-blur z-10 sticky top-[60px]">
      <div className="px-4">
        <nav className="flex space-x-4" aria-label="Tabs">
          {navItems.map((item) => {
            const href = `${baseUrl}${item.href}`;
            const isActive = item.exact
              ? pathname === href
              : pathname.startsWith(href);

            return (
              <Link
                key={item.name}
                href={href}
                className={cn(
                  "whitespace-nowrap py-3 px-1 border-b-2 text-sm font-medium transition-colors hover:text-foreground",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
