import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProjectChatHeader } from "@/components/projects/project-chat-header";
import { ProjectNav } from "@/components/projects/project-nav";
import { ProjectHeaderMobile } from "@/components/projects/project-header-mobile";

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function ProjectLayout({
  children,
  params,
}: ProjectLayoutProps) {
  const resolvedParams = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const userId = session.user.id;
  const projectId = resolvedParams.id;

  console.log("🏗️ [ProjectLayout] INICIO - Renderizando layout");
  console.log("🆔 [ProjectLayout] IDs:", { projectId, userId });
  console.log("⏰ [ProjectLayout] Timestamp:", new Date().toISOString());

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId: userId,
    },
    select: {
      id: true,
      title: true,
      isPinned: true,
    },
  });

  console.log("📦 [ProjectLayout] Proyecto encontrado:", project ? "SÍ" : "NO");
  if (project) {
    console.log("📋 [ProjectLayout] Detalles del proyecto:", {
      id: project.id,
      title: project.title,
    });
  }

  if (!project) {
    console.error("❌ [ProjectLayout] Proyecto no encontrado - mostrando 404");
    notFound();
  }

  console.log("✅ [ProjectLayout] Layout renderizado correctamente");

  return (
    <div className="flex flex-col h-full bg-background/50">
      {/* Mobile Header (combines header + nav in Sheet) */}
      <ProjectHeaderMobile
        projectId={project.id}
        initialTitle={project.title}
        initialIsPinned={project.isPinned}
        userId={userId}
      />

      {/* Desktop Header */}
      <ProjectChatHeader
        projectId={project.id}
        initialTitle={project.title}
        initialIsPinned={project.isPinned}
      />

      {/* Desktop Navigation */}
      <ProjectNav projectId={project.id} />

      <div className="flex-1 min-h-0 overflow-hidden relative">{children}</div>
    </div>
  );
}
