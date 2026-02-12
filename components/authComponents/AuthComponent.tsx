import { cn } from "@/lib/utils";
import { UserDropdown } from "../sidebar/user-dropdown";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { UserWithDetails } from "@/types/user-types";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { User } from "next-auth";

interface AuthComponentProps {
  isHome?: boolean;
  isSidebar?: boolean;
  isSidebarOpen?: boolean;
  isMobile?: boolean;
  user: UserWithDetails | null | User;
}

export const AuthComponent = ({
  isHome = false,
  isSidebar = false,
  isSidebarOpen = false,
  isMobile = false,
  user,
}: AuthComponentProps) => {
  if (isHome) {
    return (
      <div className="pt-2 h-14 flex items-center px-3.5">
        {user ? (
          <UserDropdown
            user={user as unknown as UserWithDetails}
            isSidebarOpen={isSidebarOpen}
          />
        ) : (
          <Button asChild variant={"ghost"} size={"lg"}>
            <Link href="/login" className="w-full">
              <LogIn className="size-5" />
              Iniciar Sesión
            </Link>
          </Button>
        )}
      </div>
    );
  }

  if (isSidebar) {
    return (
      <div
        className={cn(
          "sidebar-user-dropdown absolute bottom-0 left-0 right-0 bg-card border-t border-white/10 pt-2 h-14 flex items-center px-3.5",
          isSidebarOpen ? "w-full" : "w-max",
        )}
      >
        {user ? (
          <UserDropdown
            user={user as unknown as UserWithDetails}
            isSidebarOpen={isSidebarOpen}
          />
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant={"ghost"}
                  size={isSidebarOpen ? "lg" : "icon"}
                >
                  <Link
                    href="/login"
                    className={cn(
                      "w-full rounded-lg hover:bg-accent transition-all cursor-pointer",
                      isSidebarOpen ? "p-2 flex items-center gap-3" : "p-2",
                    )}
                  >
                    <LogIn
                      className={cn("size-5", isSidebarOpen ? "hidden" : "")}
                    />
                    <span
                      className={cn(
                        isSidebarOpen ? "opacity-100" : "opacity-0 sr-only",
                        "transition-opacity duration-600 flex flex-row items-center gap-2",
                      )}
                    >
                      <LogIn className="size-4" />
                      Iniciar Sesión
                    </span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side={isMobile ? "bottom" : "right"}>
                <p>Iniciar Sesión</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  }

  return (
    <div className="sidebar-user-dropdown absolute bottom-0 left-0 right-0 bg-card border-t border-white/10 h-16 flex items-center px-3">
      {user ? (
        <UserDropdown user={user as unknown as UserWithDetails} isSheet />
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant={"ghost"} size={"lg"}>
                <Link
                  href="/login"
                  className="w-full rounded-lg transition-all cursor-pointer p-2 flex items-center gap-3"
                >
                  <LogIn className="size-5" />
                  Iniciar Sesión
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Iniciar Sesión</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
