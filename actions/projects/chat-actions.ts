"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateProjectChatCompletion } from "@/lib/ai-client";
import { buildProjectSystemPrompt } from "@/lib/prompts/projects";
import { hasCredits, consumeCredits } from "@/actions/credits/service";

// ============================================
// Project Chat Generation
// ============================================

/**
 * Generate a response for a project chat (replaces API route)
 */
export async function generateProjectResponseAction({
  message,
  projectId,
}: {
  message: string;
  projectId: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const userId = session.user.id;

    // Validate inputs
    if (!projectId) return { error: "Project ID is required" };
    if (!message?.trim()) return { error: "Message cannot be empty" };

    // Validate credits
    const hasEnoughCredits = await hasCredits(userId, 1);
    if (!hasEnoughCredits) return { error: "Insufficient credits" };

    // Get Project Info
    const project = await prisma.project.findUnique({
      where: { id: projectId, userId },
    });

    if (!project) return { error: "Project not found" };

    // Get User Info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stack: true, role: true },
    });

    if (!user) return { error: "User not found" };

    // Save User Message
    await prisma.message.create({
      data: {
        role: "user",
        content: message,
        projectId: projectId,
      },
    });

    // Get History (last 50 messages)
    const history = await prisma.message.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    // Build System Prompt
    const systemPrompt = buildProjectSystemPrompt(
      {
        stack: user.stack,
        role: user.role,
      },
      {
        title: project.title,
        description: project.description,
        stack: project.stack, // If project has stack defined
      },
    );

    // Prepare Messages for AI
    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...history.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    ];

    // Generate Response (Non-streaming)
    const aiResponse = await generateProjectChatCompletion({
      messages: messages,
    });

    // Save Assistant Message
    if (aiResponse.trim().length > 0) {
      await prisma.message.create({
        data: {
          role: "assistant",
          content: aiResponse,
          projectId: projectId,
        },
      });

      // Consume Credits
      await consumeCredits(userId, 1, `Project Chat: ${projectId}`);
    }

    revalidatePath(`/chat/proyectos/${projectId}`);
    return { success: true, response: aiResponse };
  } catch (error) {
    console.error("Error generating project response:", error);
    return { error: "Failed to generate response" };
  }
}
