"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateIdeasChatCompletion } from "@/lib/ai-client";
import { buildIdeasSystemPrompt } from "@/lib/prompts/ideas";
import { hasCredits, consumeCredits } from "@/actions/credits/service";
import { generateIdeaChatTitle } from "@/lib/ai-helper";
import { getCachedData, invalidateCacheKey } from "@/actions/cache/redis-cache";

// ============================================
// Idea Chats CRUD
// ============================================

/**
 * Get all idea chats for the current user
 */
export async function getIdeaChatsAction({ userId }: { userId: string }) {
  try {
    const cacheKey = `user:${userId}:idea-chats`;
    const ideaChats = await getCachedData(cacheKey, async () => {
      return await prisma.ideaChat.findMany({
        where: {
          userId,
          messages: {
            some: {}, // Only chats with messages
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
          none: {}, // Find chats WITHOUT messages
        },
      },
      orderBy: {
        createdAt: "desc", // The most recent one
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
    const defaultTitle = title || initialMessage?.slice(0, 50) || "Nueva Idea";

    const ideaChat = await prisma.ideaChat.create({
      data: {
        title: defaultTitle,
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
    revalidatePath("/chat");
    await invalidateCacheKey(`user:${userId}:idea-chats`);

    // Generate accurate title in background
    if (initialMessage) {
      Promise.resolve().then(async () => {
        try {
          const generatedTitle = await generateIdeaChatTitle(
            title,
            initialMessage,
          );
          if (generatedTitle && generatedTitle.trim() !== "") {
            await prisma.ideaChat.update({
              where: { id: ideaChat.id },
              data: { title: generatedTitle },
            });
          }
        } catch (e) {
          console.error("Non-blocking title generation failed:", e);
        }
      });
    }

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
export async function renameIdeaChatAction(id: string, title: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const userId = session.user.id;

    const ideaChat = await prisma.ideaChat.findFirst({
      where: { id, userId },
    });

    if (!ideaChat) {
      return { error: "Idea chat not found" };
    }

    const updated = await prisma.ideaChat.update({
      where: { id },
      data: { title },
    });

    revalidatePath("/");
    revalidatePath("/chat");
    await invalidateCacheKey(`user:${userId}:idea-chats`);

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
    if (!session?.user?.id) return { error: "Unauthorized" };

    const ideaChat = await prisma.ideaChat.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!ideaChat) return { error: "Idea chat not found" };

    await prisma.ideaChat.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/chat");
    await invalidateCacheKey(`user:${session.user.id}:idea-chats`);

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
    if (!session?.user?.id) return { error: "Unauthorized" };

    const ideaChat = await prisma.ideaChat.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!ideaChat) return { error: "Idea chat not found" };

    const updated = await prisma.ideaChat.update({
      where: { id },
      data: { isPinned: !ideaChat.isPinned },
    });

    revalidatePath("/");
    revalidatePath("/chat");
    await invalidateCacheKey(`user:${session.user.id}:idea-chats`);

    return {
      success: true,
      data: updated,
    };
  } catch (error) {
    console.error("Error toggling idea chat pin:", error);
    return { error: "Failed to toggle pin" };
  }
}

// ============================================
// Idea Generation
// ============================================

/**
 * Generate a response for an idea chat (replaces API route)
 */
export async function generateIdeaResponseAction({
  message,
  chatId,
  generateOnly = false,
}: {
  message: string;
  chatId?: string;
  generateOnly?: boolean;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const userId = session.user.id;

    // Validate inputs
    if (!message?.trim()) return { error: "Message cannot be empty" };

    // Validate credits
    const hasEnoughCredits = await hasCredits(userId, 1);
    if (!hasEnoughCredits) return { error: "Insufficient credits" };

    // Get User Info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stack: true, role: true },
    });

    if (!user) return { error: "User not found" };

    // Determine Chat ID or Create New
    let ideaChatId = chatId;

    if (!ideaChatId) {
      // Create new chat
      const newChat = await prisma.ideaChat.create({
        data: {
          userId,
          title: message.slice(0, 50),
        },
      });
      ideaChatId = newChat.id;
    } else {
      // Verify existing chat
      const existingChat = await prisma.ideaChat.findFirst({
        where: { id: ideaChatId, userId },
        include: {
          messages: { select: { id: true }, take: 1 },
        },
      });

      if (!existingChat) return { error: "Chat not found" };

      // Update title if it's the first message and we are NOT just regenerating
      if (existingChat.messages.length === 0 && !generateOnly) {
        await prisma.ideaChat.update({
          where: { id: ideaChatId },
          data: { title: message.slice(0, 50) },
        });
      }
    }

    // Save User Message ONLY if not generateOnly
    if (!generateOnly) {
      await prisma.message.create({
        data: {
          role: "user",
          content: message,
          ideaChatId: ideaChatId!,
        },
      });
    }

    // Build System Prompt
    const systemPrompt = buildIdeasSystemPrompt({
      stack: user.stack,
      role: user.role,
    });

    // Generate Response (Non-streaming)
    const aiResponse = await generateIdeasChatCompletion({
      systemMessages: [{ role: "system", content: systemPrompt }],
      userMessage: { role: "user", content: message },
    });

    // Save Assistant Message
    await prisma.message.create({
      data: {
        role: "assistant",
        content: aiResponse,
        ideaChatId: ideaChatId!,
      },
    });

    // Consume Credits
    await consumeCredits(userId, 1, `Idea Chat: ${ideaChatId}`);

    await invalidateCacheKey(`user:${userId}:idea-chats`);
    revalidatePath(`/chat/ideas/${ideaChatId}`);
    return { success: true, chatId: ideaChatId, response: aiResponse };
  } catch (error) {
    console.error("Error generating idea response:", error);
    return { error: "Failed to generate response" };
  }
}
