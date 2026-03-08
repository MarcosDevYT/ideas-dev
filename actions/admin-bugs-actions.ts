"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

function isAdmin(email: string | null | undefined) {
  return email === process.env.ADMIN_EMAIL;
}

export async function getAdminBugsAction() {
  try {
    const session = await auth();
    if (!isAdmin(session?.user?.email)) {
      return { success: false, error: "No autorizado" };
    }

    const bugs = await prisma.bugReport.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return { success: true, bugs };
  } catch (error) {
    console.error("Error fetching admin bugs:", error);
    return {
      success: false,
      error: "Error interno del servidor al obtener reportes",
    };
  }
}

export async function updateBugStatusAction(bugId: string, newStatus: string) {
  try {
    const session = await auth();
    if (!isAdmin(session?.user?.email)) {
      return { success: false, error: "No autorizado" };
    }

    const updatedBug = await prisma.bugReport.update({
      where: { id: bugId },
      data: { status: newStatus },
    });

    return { success: true, bug: updatedBug };
  } catch (error) {
    console.error("Error updating bug status:", error);
    return {
      success: false,
      error: "Error al actualizar el estado del reporte",
    };
  }
}
