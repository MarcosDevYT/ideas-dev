import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { hasEnoughCredits, consumeCredits } from "@/lib/credits";
import { buildProjectSystemPrompt } from "@/lib/system-prompts";
import { streamProjectChat } from "@/lib/ai-client";
import { NextRequest, NextResponse } from "next/server";

const CHAT_COST = 10; // Créditos por mensaje

/**
 * POST /api/projects/[projectId]/chat
 * Envía un mensaje al chat del proyecto y obtiene respuesta streaming
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { projectId: string } },
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validar créditos
    const hasCredits = await hasEnoughCredits(session.user.id, CHAT_COST);
    if (!hasCredits) {
      return NextResponse.json(
        { error: "No tienes suficientes créditos" },
        { status: 402 },
      );
    }

    // Verificar ownership del proyecto
    const project = await prisma.project.findUnique({
      where: {
        id: params.projectId,
        userId: session.user.id,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          select: {
            role: true,
            content: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
        { status: 404 },
      );
    }

    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "El mensaje es requerido" },
        { status: 400 },
      );
    }

    // Obtener datos del usuario para el system prompt
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stack: true, role: true },
    });

    // Construir system prompt
    const systemPrompt = buildProjectSystemPrompt(
      {
        stack: user?.stack || null,
        role: user?.role || null,
      },
      {
        title: project.title,
        description: project.description,
        stack: project.stack,
      },
    );

    // Preparar mensajes para la API
    const messages = [
      { role: "system", content: systemPrompt },
      ...project.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    // Guardar mensaje del usuario
    await prisma.message.create({
      data: {
        projectId: params.projectId,
        role: "user",
        content: message,
      },
    });

    // Stream de respuesta
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = "";

        try {
          await streamProjectChat(messages, {
            onChunk: (chunk: string) => {
              fullResponse += chunk;
              controller.enqueue(new TextEncoder().encode(chunk));
            },
            onComplete: async () => {
              // Guardar respuesta del asistente
              await prisma.message.create({
                data: {
                  projectId: params.projectId,
                  role: "assistant",
                  content: fullResponse,
                },
              });

              // Consumir créditos
              await consumeCredits(
                session.user.id,
                CHAT_COST,
                `Chat en proyecto: ${project.title}`,
              );

              controller.close();
            },
            onError: (error: Error) => {
              console.error("Streaming error:", error);
              controller.error(error);
            },
          });
        } catch (error) {
          console.error("Error in stream:", error);
          controller.error(error);
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Error in project chat:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 },
    );
  }
}
