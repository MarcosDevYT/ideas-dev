import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { streamIdeasChat } from "@/lib/ai-client";
import { buildIdeasSystemPrompt } from "@/lib/system-prompts";
import { hasEnoughCredits, consumeCredits } from "@/lib/credits";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/ideas/chat
 * Endpoint principal para el chat de ideas con streaming
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userId = session.user.id;

    // Parsear body
    const body = await request.json();
    const { message, chatId, generateOnly } = body;

    // Validar mensaje
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

    // Validar créditos (1 crédito por mensaje)
    const hasCredits = await hasEnoughCredits(userId, 1);
    if (!hasCredits) {
      return NextResponse.json(
        { error: "No tienes créditos suficientes" },
        { status: 403 },
      );
    }

    // Obtener información del usuario para el prompt
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        stack: true,
        role: true,
        isAdmin: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    // Determinar o crear el chat
    let ideaChatId = chatId;

    if (!ideaChatId) {
      if (generateOnly) {
        return NextResponse.json(
          { error: "Chat ID es requerido para el modo de solo generación" },
          { status: 400 },
        );
      }

      // Crear nuevo chat
      const newChat = await prisma.ideaChat.create({
        data: {
          userId,
          title: message.slice(0, 50), // Usar primeras palabras como título
        },
      });
      ideaChatId = newChat.id;
    } else {
      // Verificar que el chat existe y pertenece al usuario
      const existingChat = await prisma.ideaChat.findFirst({
        where: {
          id: ideaChatId,
          userId,
        },
        include: {
          messages: {
            select: { id: true },
            take: 1, // Solo necesitamos saber si hay al menos uno
          },
        },
      });

      if (!existingChat) {
        return NextResponse.json(
          { error: "Chat no encontrado" },
          { status: 404 },
        );
      }

      // Si es el primer mensaje en un chat existente (reutilizado), actualizar el título
      if (existingChat.messages.length === 0) {
        await prisma.ideaChat.update({
          where: { id: ideaChatId },
          data: {
            title: message.slice(0, 50),
          },
        });
      }
    }

    // Guardar mensaje del usuario (SOLO si no es generateOnly)
    if (!generateOnly) {
      await prisma.message.create({
        data: {
          role: "user",
          content: message,
          ideaChatId: ideaChatId!,
        },
      });
    } // Construir prompt del sistema
    const systemPrompt = buildIdeasSystemPrompt({
      stack: user.stack,
      role: user.role,
    });

    // Realizar streaming de la respuesta
    const aiStream = await streamIdeasChat({
      systemMessages: [{ role: "system", content: systemPrompt }],
      userMessage: { role: "user", content: message },
    });

    // Crear stream para el cliente
    let fullResponse = "";

    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk);
        fullResponse += text;
        controller.enqueue(chunk);
      },
      async flush() {
        // Guardar respuesta completa de la IA
        await prisma.message.create({
          data: {
            role: "assistant",
            content: fullResponse,
            ideaChatId,
          },
        });

        // Consumir créditos
        await consumeCredits(userId, 1, `Chat de ideas: ${ideaChatId}`);
      },
    });

    const stream = aiStream.pipeThrough(transformStream);

    // Retornar respuesta con streaming
    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Chat-Id": ideaChatId,
      },
    });
  } catch (error) {
    console.error("Error en /api/ideas/chat:", error);
    return NextResponse.json(
      {
        error: "Error al procesar el mensaje",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    );
  }
}
