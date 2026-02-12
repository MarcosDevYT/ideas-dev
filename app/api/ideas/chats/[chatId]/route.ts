import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    chatId: string;
  }>;
}

/**
 * GET /api/ideas/chats/[chatId]
 * Obtiene un chat específico con sus mensajes
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userId = session.user.id;
    const { chatId } = await params;

    // Obtener chat con mensajes
    const chat = await prisma.ideaChat.findFirst({
      where: {
        id: chatId,
        userId,
      },
      select: {
        id: true,
        title: true,
        isPinned: true,
        createdAt: true,
        updatedAt: true,
        messages: {
          select: {
            id: true,
            role: true,
            content: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!chat) {
      return NextResponse.json(
        { error: "Chat no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ chat });
  } catch (error) {
    console.error("Error en GET /api/ideas/chats/[chatId]:", error);
    return NextResponse.json(
      { error: "Error al obtener el chat" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/ideas/chats/[chatId]
 * Actualiza un chat (título, pin)
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userId = session.user.id;
    const { chatId } = await params;

    // Verificar que el chat existe y pertenece al usuario
    const existingChat = await prisma.ideaChat.findFirst({
      where: {
        id: chatId,
        userId,
      },
    });

    if (!existingChat) {
      return NextResponse.json(
        { error: "Chat no encontrado" },
        { status: 404 },
      );
    }

    // Parsear body
    const body = await request.json();
    const { title, isPinned } = body;

    // Actualizar chat
    const updatedChat = await prisma.ideaChat.update({
      where: { id: chatId },
      data: {
        ...(title !== undefined && { title }),
        ...(isPinned !== undefined && { isPinned }),
      },
    });

    return NextResponse.json(updatedChat);
  } catch (error) {
    console.error("Error en PATCH /api/ideas/chats/[chatId]:", error);
    return NextResponse.json(
      { error: "Error al actualizar el chat" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/ideas/chats/[chatId]
 * Elimina un chat y todos sus mensajes
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userId = session.user.id;
    const { chatId } = await params;

    // Verificar que el chat existe y pertenece al usuario
    const existingChat = await prisma.ideaChat.findFirst({
      where: {
        id: chatId,
        userId,
      },
    });

    if (!existingChat) {
      return NextResponse.json(
        { error: "Chat no encontrado" },
        { status: 404 },
      );
    }

    // Eliminar chat (los mensajes se eliminan en cascada)
    await prisma.ideaChat.delete({
      where: { id: chatId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en DELETE /api/ideas/chats/[chatId]:", error);
    return NextResponse.json(
      { error: "Error al eliminar el chat" },
      { status: 500 },
    );
  }
}
