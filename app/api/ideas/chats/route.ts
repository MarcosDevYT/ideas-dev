import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { canCreateIdeaChat } from "@/lib/credits";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/ideas/chats
 * Obtiene la lista de chats de ideas del usuario
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userId = session.user.id;

    // Obtener chats con conteo de mensajes
    const chats = await prisma.ideaChat.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        isPinned: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { messages: true },
        },
      },
      orderBy: [
        { isPinned: "desc" }, // Pinned primero
        { updatedAt: "desc" }, // Más recientes primero
      ],
    });

    // Verificar si es admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true },
    });

    const limit = user?.isAdmin ? Infinity : 5;

    return NextResponse.json({
      chats,
      count: chats.length,
      limit,
    });
  } catch (error) {
    console.error("Error en GET /api/ideas/chats:", error);
    return NextResponse.json(
      { error: "Error al obtener los chats" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/ideas/chats
 * Crea un nuevo chat de ideas
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userId = session.user.id;

    // Verificar límite de chats
    const canCreate = await canCreateIdeaChat(userId);
    if (!canCreate) {
      return NextResponse.json(
        { error: "Has alcanzado el límite de 5 chats de ideas" },
        { status: 403 },
      );
    }

    // Parsear body
    const body = await request.json();
    const { title } = body;

    // Crear chat
    const chat = await prisma.ideaChat.create({
      data: {
        userId,
        title: title || "Nuevo Chat",
      },
    });

    return NextResponse.json(chat, { status: 201 });
  } catch (error) {
    console.error("Error en POST /api/ideas/chats:", error);
    return NextResponse.json(
      { error: "Error al crear el chat" },
      { status: 500 },
    );
  }
}
