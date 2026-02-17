"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateProjectTitle } from "@/lib/ai-helper";

// ============================================
// Projects Actions (CRUD)
// ============================================

/**
 * Get all projects for the current user
 */
export async function getProjectsAction({ userId }: { userId: string }) {
  try {
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
      select: {
        id: true,
        title: true,
        description: true,
        isPinned: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      success: true,
      data: projects,
    };
  } catch (error) {
    console.error("Error getting projects:", error);
    return { error: "Failed to get projects" };
  }
}

/**
 * Create a new project
 */
export async function createProjectAction(
  name: string,
  description: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  originalIdea?: any,
) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    let finalName = name;

    // If we have the original idea, try to generate a better title
    if (originalIdea) {
      const generatedName = await generateProjectTitle(
        description,
        originalIdea,
      );

      if (generatedName && generatedName.length > 0) {
        finalName = generatedName;
      }
    }

    const project = await prisma.project.create({
      data: {
        title: finalName,
        description,
        userId: session.user.id,
        originalIdea: originalIdea ?? undefined,
      },
    });

    revalidatePath("/chat/proyectos");
    revalidatePath(`/chat/proyectos/${project.id}`);

    return { success: true, projectId: project.id };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: "Error creating project" };
  }
}

/**
 * Rename a project
 */
export async function renameProjectAction(id: string, title: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const project = await prisma.project.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!project) return { error: "Project not found" };

    const updated = await prisma.project.update({
      where: { id },
      data: { title },
    });

    revalidatePath("/");
    revalidatePath("/chat/proyectos");

    return {
      success: true,
      data: updated,
    };
  } catch (error) {
    console.error("Error renaming project:", error);
    return { error: "Failed to rename project" };
  }
}

/**
 * Delete a project
 */
export async function deleteProjectAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const project = await prisma.project.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!project) return { error: "Project not found" };

    await prisma.project.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/chat/proyectos");

    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { error: "Failed to delete project" };
  }
}

/**
 * Toggle pin status for a project
 */
export async function toggleProjectPinAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const project = await prisma.project.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!project) return { error: "Project not found" };

    const updated = await prisma.project.update({
      where: { id },
      data: { isPinned: !project.isPinned },
    });

    revalidatePath("/");
    revalidatePath("/chat/proyectos");

    return {
      success: true,
      data: updated,
    };
  } catch (error) {
    console.error("Error toggling project pin:", error);
    return { error: "Failed to toggle pin" };
  }
}

/**
 * Generate AI Summary for a project
 */
export async function generateProjectSummaryAction(projectId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };
    const userId = session.user.id;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: 20,
        },
        user: { select: { credits: true } },
      },
    });

    if (!project) return { error: "Project not found" };
    if (project.userId !== userId) return { error: "Unauthorized" };

    if ((project.user.credits || 0) < 1) {
      return { error: "Insufficient credits" };
    }

    const { generateProjectSummary } = await import("@/lib/ai-helper");

    const summary = await generateProjectSummary(
      project.description,
      project.messages.map((m) => ({ role: m.role, content: m.content })),
    );

    await prisma.$transaction([
      prisma.project.update({
        where: { id: projectId },
        data: { aiSummary: summary },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 1 } },
      }),
    ]);

    revalidatePath(`/chat/proyectos/${projectId}`);

    return { success: true, summary };
  } catch (error) {
    console.error("Error generating summary:", error);
    return { error: "Failed to generate summary" };
  }
}

/**
 * Generate AI Tasks for a project
 */
export async function generateProjectTasksAction(projectId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };
    const userId = session.user.id;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        messages: { orderBy: { createdAt: "asc" }, take: 20 },
        user: { select: { credits: true } },
      },
    });

    if (!project) return { error: "Project not found" };
    if (project.userId !== userId) return { error: "Unauthorized" };

    if ((project.user.credits || 0) < 1) {
      return { error: "Insufficient credits" };
    }

    const { generateProjectTasks } = await import("@/lib/ai-helper");

    const tasksData = await generateProjectTasks(
      project.description,
      project.aiSummary,
      project.messages.map((m) => ({ role: m.role, content: m.content })),
    );

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { credits: { decrement: 1 } },
      });

      await tx.task.createMany({
        data: tasksData.map((task) => ({
          title: task.title,
          status: "pending",
          projectId: projectId,
        })),
      });
    });

    revalidatePath(`/chat/proyectos/${projectId}/tasks`);
    return { success: true };
  } catch (error) {
    console.error("Error generating tasks:", error);
    return { error: "Failed to generate tasks" };
  }
}

/**
 * Task Management Actions
 */

export async function getProjectTasksAction(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) return [];

  const project = await prisma.project.findUnique({
    where: { id: projectId, userId: session.user.id },
  });

  if (!project) return [];

  return await prisma.task.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createTaskAction(projectId: string, title: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const project = await prisma.project.findUnique({
      where: { id: projectId, userId: session.user.id },
    });

    if (!project) return { error: "Unauthorized" };

    await prisma.task.create({
      data: {
        title,
        projectId,
      },
    });

    revalidatePath(`/chat/proyectos/${projectId}/tasks`);
    return { success: true };
  } catch (error) {
    console.error("Error creating task:", error);
    return { error: "Failed to create task" };
  }
}

export async function toggleTaskStatusAction(
  taskId: string,
  currentStatus: string,
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await prisma.task.update({
      where: { id: taskId },
      data: {
        status: currentStatus === "completed" ? "pending" : "completed",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error toggling task:", error);
    return { error: "Failed to toggle task" };
  }
}

export async function deleteTaskAction(taskId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await prisma.task.delete({
      where: { id: taskId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { error: "Failed to delete task" };
  }
}

/**
 * Resource Management Actions
 */

export async function generateProjectResourcesAction(projectId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };
    const userId = session.user.id;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        messages: { orderBy: { createdAt: "asc" }, take: 20 },
        user: { select: { credits: true } },
      },
    });

    if (!project) return { error: "Project not found" };
    if (project.userId !== userId) return { error: "Unauthorized" };

    if ((project.user.credits || 0) < 1) {
      return { error: "Insufficient credits" };
    }

    const { generateProjectResources } = await import("@/lib/ai-helper");

    const resourcesData = await generateProjectResources(
      project.description,
      project.aiSummary,
      project.messages.map((m) => ({ role: m.role, content: m.content })),
    );

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { credits: { decrement: 1 } },
      });

      await tx.resource.createMany({
        data: resourcesData.map((res) => ({
          title: res.title,
          type: res.type || "link",
          url: res.url || null,
          projectId: projectId,
        })),
      });
    });

    revalidatePath(`/chat/proyectos/${projectId}/resources`);
    return { success: true };
  } catch (error) {
    console.error("Error generating resources:", error);
    return { error: "Failed to generate resources" };
  }
}

export async function getProjectResourcesAction(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) return [];

  const project = await prisma.project.findUnique({
    where: { id: projectId, userId: session.user.id },
  });

  if (!project) return [];

  return await prisma.resource.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createResourceAction(
  projectId: string,
  title: string,
  url?: string,
  type: string = "link",
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const project = await prisma.project.findUnique({
      where: { id: projectId, userId: session.user.id },
    });

    if (!project) return { error: "Unauthorized" };

    await prisma.resource.create({
      data: {
        title,
        url,
        type,
        projectId,
      },
    });

    revalidatePath(`/chat/proyectos/${projectId}/resources`);
    return { success: true };
  } catch (error) {
    console.error("Error creating resource:", error);
    return { error: "Failed to create resource" };
  }
}

export async function deleteResourceAction(resourceId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await prisma.resource.delete({
      where: { id: resourceId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting resource:", error);
    return { error: "Failed to delete resource" };
  }
}
