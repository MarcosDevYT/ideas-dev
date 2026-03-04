import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProjectChatClient } from "@/components/projects/project-chat-client";

type Params = Promise<{ id: string }>;

export default async function ProjectChatPage(props: { params: Params }) {
  const params = await props.params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const userId = session.user.id;
  const projectId = params.id;

  // 1. Obtener proyecto
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId: userId,
    },
  });

  if (project) {
    console.log("📋 [ProjectChatPage] Detalles del proyecto:", {
      id: project.id,
      title: project.title,
    });
  }

  if (!project) {
    console.error(
      "❌ [ProjectChatPage] Proyecto no encontrado - mostrando 404",
    );
    notFound();
  }

  // 2. Obtener créditos del usuario
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { planCredits: true, extraCredits: true },
  });

  // 3. Obtener historial de mensajes
  const messages = await prisma.message.findMany({
    where: {
      projectId: projectId,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 100, // Limitar historial inicial
  });

  // 4. Formatear mensajes para el cliente
  const formattedMessages = messages.map((msg) => ({
    id: msg.id,
    role: msg.role as "user" | "assistant" | "system",
    content: msg.content,
    timestamp: msg.createdAt,
  }));

  return (
    <ProjectChatClient
      initialMessages={formattedMessages}
      projectId={project.id}
      userCredits={(user?.planCredits || 0) + (user?.extraCredits || 0)}
    />
  );
}
