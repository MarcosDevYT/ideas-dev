import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { streamProjectChat } from "@/lib/ai-client";
import { buildProjectSystemPrompt } from "@/lib/system-prompts";
import { hasEnoughCredits, consumeCredits } from "@/lib/credits";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/projects/chat
 * Endpoint para el chat de proyectos con memoria
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticación
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userId = session.user.id;

    // 2. Parsear body
    const body = await request.json();
    const { message, projectId } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID es requerido" },
        { status: 400 },
      );
    }

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "El mensaje no puede estar vacío" },
        { status: 400 },
      );
    }

    // 3. Validar créditos (1 crédito por mensaje)
    const hasCredits = await hasEnoughCredits(userId, 1);
    if (!hasCredits) {
      return NextResponse.json(
        { error: "No tienes créditos suficientes" },
        { status: 403 },
      );
    }

    // 4. Obtener información del proyecto y usuario
    const project = await prisma.project.findUnique({
      where: { id: projectId, userId },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
        { status: 404 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        stack: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    // 5. Guardar mensaje del usuario
    await prisma.message.create({
      data: {
        role: "user",
        content: message,
        projectId: projectId,
      },
    });

    // 6. Cargar historial de mensajes del proyecto (últimos 50 para contexto)
    const history = await prisma.message.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
      take: 50, // Límite de contexto para no exceder tokens
    });

    // 7. Construir prompt del sistema
    const systemPrompt = buildProjectSystemPrompt(
      {
        stack: user.stack,
        role: user.role,
      },
      {
        title: project.title,
        description: project.description,
        stack: project.stack, // Si el proyecto tiene stack definido
      },
    );

    // 8. Preparar mensajes para la IA
    // Mapear historial al formato de la API
    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...history.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      // No necesitamos añadir el user message actual aquí porque ya está en 'history' tras guardarlo en DB?
      // Espera, si acabamos de guardar el mensaje en el paso 5, y cargamos el historial en el paso 6,
      // el mensaje actual YA debería estar en 'history'.
    ];

    // 9. Realizar streaming de la respuesta
    const aiStream = await streamProjectChat({
      messages: messages,
    });

    // 10. Crear stream para el cliente y guardar respuesta completa
    let fullResponse = "";

    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk, { stream: true });
        fullResponse += text;
        controller.enqueue(chunk);
      },
      async flush() {
        // Guardar respuesta completa de la IA asociado al proyecto
        if (fullResponse.trim().length > 0) {
          await prisma.message.create({
            data: {
              role: "assistant",
              content: fullResponse,
              projectId: projectId,
            },
          });

          // Consumir créditos
          await consumeCredits(userId, 1, `Chat de proyecto: ${projectId}`);
        }
      },
    });

    const stream = aiStream.pipeThrough(transformStream);

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Project-Id": projectId,
      },
    });
  } catch (error) {
    console.error("Error en /api/projects/chat:", error);
    return NextResponse.json(
      {
        error: "Error al procesar el mensaje",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    );
  }
}
