"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AppWindowMac, Coins } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";
import { useMediaQueryCustom } from "@/hooks/mediaQueryHook";
import { LogoComponent } from "../LogoComponent";
import { getIdeaChatsAction } from "@/actions/ideas/chat-actions";
import { getProjectsAction } from "@/actions/projects/project-actions";
import { getUserCreditsAction } from "@/actions/credits";
import { eventBus, EVENTS } from "@/lib/events";
import Link from "next/link";
import { SheetItems, SidebarItems } from "./SidebarItems";
import { Badge } from "../ui/badge";
import { NewChatLink } from "@/components/links/new-chat-link";
import { AuthComponent } from "../authComponents/AuthComponent";
import { Session, User } from "next-auth";
import { ThemeButton } from "../ui/theme-button";

type CustomUser = Session["user"];

export interface ChatData {
  id: string;
  title: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectData {
  id: string;
  title: string;
  description?: string | null;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const Sidebar = ({ user }: { user?: CustomUser }) => {
  // Estados
  const [localCredits, setLocalCredits] = useState<number | null>(null);
  const credits = localCredits !== null ? localCredits : user?.credits || 0;

  const [chats, setChats] = useState<ChatData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isMobile = useMediaQueryCustom("(max-width: 768px)");

  /* Funcionalidad del Sidebar */

  const toggle = () => {
    if (isMobile) {
      setIsSheetOpen(!isSheetOpen);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const closeSheet = () => {
    if (isMobile) {
      setIsSheetOpen(false);
    } else {
      setIsSidebarOpen(false);
    }
  };

  const handleDelete = (id: string, type: "chat" | "project") => {
    if (type === "chat") {
      setChats((prev) => prev.filter((chat) => chat.id !== id));
    } else {
      setProjects((prev) => prev.filter((project) => project.id !== id));
    }
  };

  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;

    const loadData = async () => {
      // Cargamos chats
      setIsLoadingChats(true);
      const chatsResult = await getIdeaChatsAction({ userId });
      setIsLoadingChats(false);
      if (chatsResult.success && chatsResult.data) {
        setChats(chatsResult.data);
      }

      // Cargamos proyectos
      setIsLoadingProjects(true);
      const projectsResult = await getProjectsAction({ userId });
      setIsLoadingProjects(false);
      if (projectsResult.success && projectsResult.data) {
        setProjects(projectsResult.data);
      }

      // Cargamos créditos actualizados
      const creditsResult = await getUserCreditsAction();
      if (creditsResult.success && typeof creditsResult.data === "number") {
        setLocalCredits(creditsResult.data);
      }
    };

    loadData();

    const handleRefresh = () => {
      loadData();
    };

    eventBus.on(EVENTS.REFRESH_SIDEBAR, handleRefresh);

    return () => {
      eventBus.off(EVENTS.REFRESH_SIDEBAR, handleRefresh);
    };
  }, [user?.id]);
  return (
    <header
      className={cn(
        "bg-card fixed top-0 left-0 right-0 z-50 md:static px-3.5 md:px-0 flex flex-col items-center transition-all duration-300 ease-in-out overflow-clip",
        isSidebarOpen ? "w-full md:max-w-72" : "w-full md:max-w-17",
      )}
    >
      <div className="md:sticky md:top-0 md:h-screen w-full flex flex-col">
        {/* Top (logo + botón menu) */}
        <div className="w-full h-16 md:pt-4 flex items-center justify-between md:justify-start md:px-3.5">
          <Link href="/" className="md:hidden">
            <LogoComponent className="text-2xl" />
          </Link>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-full"
                  size="icon"
                  onClick={toggle}
                >
                  <AppWindowMac className="size-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side={isMobile ? "bottom" : "right"}>
                <p>Menu</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {!isMobile && (
            <Link href="/">
              <LogoComponent
                className={`${isSidebarOpen ? "opacity-100" : "opacity-0"} ml-2 text-2xl transition-all duration-300 ease-in-out`}
              />
            </Link>
          )}
        </div>

        {/* Mobile */}
        {isMobile && (
          <Sheet open={isSheetOpen} onOpenChange={closeSheet}>
            <SheetContent className="w-[280px] flex flex-col">
              <SheetHeader className="mt-2">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              <div className="w-full flex flex-col flex-1 px-3 space-y-2 relative pb-16 overflow-hidden">
                {user && <NewChatLink />}

                {user && (
                  <Button asChild variant="outline" className="h-9 w-full">
                    <Link href="/credits" className="flex items-center gap-2">
                      <Coins className="size-4" />
                      Créditos
                      <Badge variant="secondary" className="ml-auto">
                        {credits}
                      </Badge>
                    </Link>
                  </Button>
                )}

                {user && (
                  <div className="w-full">
                    <ThemeButton />
                  </div>
                )}

                <nav className="flex-1 px-1 gap-2 flex flex-col mt-2 overflow-hidden">
                  {user && (
                    <SheetItems
                      chats={chats}
                      projects={projects}
                      isLoadingChats={isLoadingChats}
                      isLoadingProjects={isLoadingProjects}
                      onDelete={handleDelete}
                    />
                  )}
                </nav>

                {/* Auth Component Mobile */}
                <AuthComponent
                  isSidebar={false}
                  isSidebarOpen={isSidebarOpen}
                  isMobile={isMobile}
                  user={user as User}
                />
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Desktop */}
        {!isMobile && (
          <nav className="hidden md:flex h-full flex-col items-start px-3.5 gap-2 my-2 w-full relative pb-16">
            {user && <NewChatLink isCollapsed={!isSidebarOpen} />}

            {user && (
              <Link
                href="/credits"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-9 overflow-clip",
                  isSidebarOpen ? "w-full" : "w-9",
                )}
              >
                <Coins
                  className={cn("size-4", isSidebarOpen ? "hidden" : "")}
                />

                <span
                  className={cn(
                    isSidebarOpen ? "opacity-100" : "opacity-0 sr-only",
                    "w-full transition-opacity duration-600 flex flex-row items-center gap-2",
                  )}
                >
                  <Coins className="size-4" />
                  <span>Créditos</span>

                  <Badge variant="secondary" className="ml-auto">
                    {credits}
                  </Badge>
                </span>
              </Link>
            )}

            {user && (
              <div
                className={cn(
                  "overflow-clip",
                  isSidebarOpen ? "w-full" : "w-9",
                )}
              >
                <ThemeButton isCollapsed={!isSidebarOpen} />
              </div>
            )}

            <div className="w-full flex-1 overflow-hidden mt-2">
              {user && (
                <SidebarItems
                  chats={chats}
                  projects={projects}
                  isLoadingChats={isLoadingChats}
                  isLoadingProjects={isLoadingProjects}
                  isSidebarOpen={isSidebarOpen}
                  onDelete={handleDelete}
                />
              )}
            </div>

            {/* Auth Component Desktop */}
            <AuthComponent
              isSidebar={true}
              isSidebarOpen={isSidebarOpen}
              isMobile={isMobile}
              user={user as User}
            />
          </nav>
        )}
      </div>
    </header>
  );
};
