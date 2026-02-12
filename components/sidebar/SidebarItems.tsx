"use client";

import { FolderKanban, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { ChatItem } from "./chat-item";
import { Separator } from "../ui/separator";
import { ChatData, ProjectData } from "./Sidebar";
import { Skeleton } from "../ui/skeleton";

export const SheetItems = ({
  chats,
  projects,
  isLoadingChats,
  isLoadingProjects,
  onDelete,
}: {
  chats: ChatData[];
  projects: ProjectData[];
  isLoadingChats: boolean;
  isLoadingProjects: boolean;
  onDelete: (id: string, type: "chat" | "project") => void;
}) => {
  return (
    <div className="h-full flex flex-col">
      {/* Ideas */}
      <article className="flex flex-col gap-2 flex-1 min-h-0">
        <div className="flex items-center gap-2 ml-2">
          <MessageSquare className="size-4" />
          Ideas
        </div>

        <Separator />

        {chats.length === 0 && (
          <p className="text-gray-500 text-sm ml-2">No hay ideas</p>
        )}

        <ScrollArea className="w-full flex-1">
          {isLoadingChats ? (
            <div className="text-center text-sm text-sidebar-foreground/50 flex flex-col gap-2">
              Cargando ideas...
              <Skeleton className="w-full h-8" />
              <Skeleton className="w-full h-8" />
              <Skeleton className="w-full h-8" />
            </div>
          ) : chats.length === 0 ? null : (
            chats.map((chat) => (
              <ChatItem
                isSheet
                key={chat.id}
                id={chat.id}
                title={chat.title}
                isPinned={chat.isPinned}
                type="chat"
                onDelete={onDelete}
              />
            ))
          )}
        </ScrollArea>
      </article>

      {/* Projects */}
      <article className="flex flex-col gap-2 flex-1 min-h-0 mt-4">
        <div className="flex items-center gap-2 ml-2">
          <FolderKanban className="size-4" />
          Proyectos
        </div>

        <Separator />

        {projects.length === 0 && (
          <p className="text-gray-500 text-sm ml-2">No hay proyectos</p>
        )}

        <ScrollArea className="w-full flex-1">
          {isLoadingProjects ? (
            <div className="text-center text-sm text-sidebar-foreground/50 flex flex-col gap-2">
              Cargando proyectos...
              <Skeleton className="w-full h-8" />
              <Skeleton className="w-full h-8" />
              <Skeleton className="w-full h-8" />
            </div>
          ) : projects.length === 0 ? null : (
            projects.map((project) => (
              <ChatItem
                isSheet
                key={project.id}
                id={project.id}
                title={project.title}
                isPinned={project.isPinned}
                type="project"
                onDelete={onDelete}
              />
            ))
          )}
        </ScrollArea>
      </article>
    </div>
  );
};

export const SidebarItems = ({
  chats,
  projects,
  isLoadingChats,
  isLoadingProjects,
  isSidebarOpen,
  onDelete,
}: {
  chats: ChatData[];
  projects: ProjectData[];
  isLoadingChats: boolean;
  isLoadingProjects: boolean;
  isSidebarOpen: boolean;
  onDelete: (id: string, type: "chat" | "project") => void;
}) => {
  return (
    <div
      className={cn(
        "transition-opacity duration-300 w-[260px] overflow-clip h-full flex flex-col",
        isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      {/* Ideas */}

      <article className="flex flex-col gap-2 flex-1 min-h-0">
        <div className="flex items-center gap-2 ml-2">
          <MessageSquare className="size-4" />
          <span>Ideas</span>
        </div>

        <Separator />

        {chats.length === 0 && (
          <p className="text-gray-500 text-sm ml-2">No hay ideas</p>
        )}

        <ScrollArea className="w-full flex-1">
          {isLoadingChats ? (
            <div className="text-center text-sm text-sidebar-foreground/50 flex flex-col gap-2">
              Cargando ideas...
              <Skeleton className="w-full h-8" />
              <Skeleton className="w-full h-8" />
              <Skeleton className="w-full h-8" />
            </div>
          ) : chats.length === 0 ? null : (
            chats.map((chat) => (
              <ChatItem
                key={chat.id}
                id={chat.id}
                title={chat.title}
                isPinned={chat.isPinned}
                type="chat"
                onDelete={onDelete}
              />
            ))
          )}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </article>

      {/* Projects */}
      <article className="flex flex-col gap-2 flex-1 min-h-0 mt-4">
        <div className="flex items-center gap-2 ml-1 ">
          <FolderKanban className="size-4" />

          <span>Proyectos</span>
        </div>

        <Separator />

        {projects.length === 0 && (
          <p className="text-gray-500 text-sm ml-2">No hay proyectos</p>
        )}

        <ScrollArea className="w-full flex-1">
          {isLoadingProjects ? (
            <div className="text-center text-sm text-sidebar-foreground/50 flex flex-col gap-2">
              Cargando proyectos...
              <Skeleton className="w-full h-8" />
              <Skeleton className="w-full h-8" />
              <Skeleton className="w-full h-8" />
            </div>
          ) : projects.length === 0 ? null : (
            projects.map((project) => (
              <ChatItem
                key={project.id}
                id={project.id}
                title={project.title}
                isPinned={project.isPinned}
                type="project"
                onDelete={onDelete}
              />
            ))
          )}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </article>
    </div>
  );
};
