"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ============================================
// Idea Chats
// ============================================

/**
 * Get all idea chats for the current user
 */
export async function getIdeaChatsAction({ userId }: { userId: string }) {
  try {
    const ideaChats = await prisma.ideaChat.findMany({
      where: {
        userId,
        messages: {
          some: {}, // Solo traer chats que tengan al menos 1 mensaje
        },
      },
      orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
      select: {
        id: true,
        title: true,
        isPinned: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      success: true,
      data: ideaChats,
    };
  } catch (error) {
    console.error("Error getting idea chats:", error);
    return { error: "Failed to get idea chats" };
  }
}

/**
 * Get an existing empty chat for the user (to reuse instead of creating new ones)
 */
export async function getEmptyChatAction({ userId }: { userId: string }) {
  try {
    const emptyChat = await prisma.ideaChat.findFirst({
      where: {
        userId,
        messages: {
          none: {}, // Buscar chats SIN mensajes
        },
      },
      orderBy: {
        createdAt: "desc", // El más reciente
      },
      select: {
        id: true,
      },
    });

    return {
      success: true,
      data: emptyChat,
    };
  } catch (error) {
    console.error("Error getting empty chat:", error);
    return { error: "Failed to get empty chat" };
  }
}

/**
 * Create a new idea chat
 */
export async function createIdeaChatAction({
  userId,
  title,
  initialMessage,
}: {
  userId: string;
  title: string;
  initialMessage?: string;
}) {
  try {
    const ideaChat = await prisma.ideaChat.create({
      data: {
        title,
        userId,
        messages: initialMessage
          ? {
              create: {
                content: initialMessage,
                role: "user",
              },
            }
          : undefined,
      },
    });

    revalidatePath("/");

    return {
      success: true,
      data: ideaChat,
    };
  } catch (error) {
    console.error("Error creating idea chat:", error);
    return { error: "Failed to create idea chat" };
  }
}

/**
 * Rename an idea chat
 */
export async function renameIdeaChatAction(
  id: string,
  title: string,
  userId: string,
) {
  try {
    // Verify ownership
    const ideaChat = await prisma.ideaChat.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!ideaChat) {
      return { error: "Idea chat not found" };
    }

    const updated = await prisma.ideaChat.update({
      where: { id },
      data: { title },
    });

    revalidatePath("/");

    return {
      success: true,
      data: updated,
    };
  } catch (error) {
    console.error("Error renaming idea chat:", error);
    return { error: "Failed to rename idea chat" };
  }
}

/**
 * Delete an idea chat
 */
export async function deleteIdeaChatAction(id: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    // Verify ownership
    const ideaChat = await prisma.ideaChat.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!ideaChat) {
      return { error: "Idea chat not found" };
    }

    await prisma.ideaChat.delete({
      where: { id },
    });

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error deleting idea chat:", error);
    return { error: "Failed to delete idea chat" };
  }
}

/**
 * Toggle pin status for an idea chat
 */
export async function toggleIdeaChatPinAction(id: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    // Verify ownership
    const ideaChat = await prisma.ideaChat.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!ideaChat) {
      return { error: "Idea chat not found" };
    }

    const updated = await prisma.ideaChat.update({
      where: { id },
      data: { isPinned: !ideaChat.isPinned },
    });

    revalidatePath("/");

    return {
      success: true,
      data: updated,
    };
  } catch (error) {
    console.error("Error toggling idea chat pin:", error);
    return { error: "Failed to toggle pin" };
  }
}

// End of Idea Chats Actions
