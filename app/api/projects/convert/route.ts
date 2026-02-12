import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { canCreateProject } from "@/lib/credits";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/projects/convert
 * Convierte un chat de idea en un proyecto
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { ideaChatId, deleteOriginalChat = false } = body;

    if (!ideaChatId || typeof ideaChatId !== "string") {
      return NextResponse.json(
        { error: "El ID del chat de idea es requerido" },
        { status: 400 },
      );
    }

    // Verificar que el chat de idea existe y pertenece al usuario
    const ideaChat = await prisma.ideaChat.findUnique({
      where: {
        id: ideaChatId,
        userId: session.user.id,
      },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 10, // Últimos 10 mensajes para extraer contexto
        },
      },
    });

    if (!ideaChat) {
      return NextResponse.json(
        { error: "Chat de idea no encontrado" },
        { status: 404 },
      );
    }

    // Validar límite de proyectos
    const canCreate = await canCreateProject(session.user.id);
    if (!canCreate) {
      return NextResponse.json(
        { error: "Has alcanzado el límite de 10 proyectos" },
        { status: 403 },
      );
    }

    // Extraer información del chat para el proyecto
    const title = ideaChat.title || "Nuevo Proyecto";

    // Buscar el último mensaje del asistente para usar como descripción
    const lastAssistantMessage = ideaChat.messages.find(
      (msg) => msg.role === "assistant",
    );

    // Intentar extraer stack del último mensaje
    let suggestedStack: string | null = null;
    if (lastAssistantMessage?.content) {
      // Buscar patrones como "Stack sugerido:" o "### Stack sugerido"
      const stackMatch = lastAssistantMessage.content.match(
        /(?:Stack sugerido|Stack tecnológico|Stack preferido)[:\s]*\n([^\n]+(?:\n-[^\n]+)*)/i,
      );
      if (stackMatch) {
        suggestedStack = stackMatch[1].trim();
      }
    }

    // Crear el proyecto
    const project = await prisma.project.create({
      data: {
        userId: session.user.id,
        title,
        description: lastAssistantMessage?.content || null,
        stack: suggestedStack,
      },
    });

    // Crear mensaje system inicial con contexto del chat
    const contextMessage = `Este proyecto fue creado a partir de una idea generada en el chat de ideas.

Título original: ${ideaChat.title}

Contexto de la conversación:
${ideaChat.messages
  .slice(0, 5)
  .reverse()
  .map(
    (msg) =>
      `${msg.role === "user" ? "Usuario" : "Asistente"}: ${msg.content.substring(0, 200)}${msg.content.length > 200 ? "..." : ""}`,
  )
  .join("\n\n")}`;

    await prisma.message.create({
      data: {
        projectId: project.id,
        role: "system",
        content: contextMessage,
      },
    });

    // Eliminar chat original si se solicitó
    if (deleteOriginalChat) {
      await prisma.ideaChat.delete({
        where: { id: ideaChatId },
      });
    }

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Error converting idea to project:", error);
    return NextResponse.json(
      { error: "Failed to convert idea to project" },
      { status: 500 },
    );
  }
}
