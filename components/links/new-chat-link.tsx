"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface NewChatLinkProps {
  className?: string;
  isCollapsed?: boolean;
}

export function NewChatLink({ className, isCollapsed }: NewChatLinkProps) {
  return (
    <Link
      href="/chat"
      className={cn(
        buttonVariants({ variant: "default", size: "sm" }),
        "bg-linear-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600 text-white border-0",
        isCollapsed
          ? "w-9 h-9 p-0 justify-center"
          : "w-full justify-center gap-2",
        className,
      )}
    >
      <Plus className="h-4 w-4" />
      {!isCollapsed && <span>Nuevo Chat</span>}
    </Link>
  );
}
