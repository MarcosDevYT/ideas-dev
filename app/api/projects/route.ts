import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import {
  canCreateProject,
  consumeCredits,
  hasEnoughCredits,
} from "@/lib/credits";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/projects
 * Lista todos los proyectos del usuario autenticado
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const cursor = searchParams.get("cursor");

    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
      take: limit,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      select: {
        id: true,
        title: true,
        description: true,
        stack: true,
        isPinned: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { messages: true },
        },
      },
    });

    return NextResponse.json({
      projects,
      nextCursor:
        projects.length === limit ? projects[projects.length - 1].id : null,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/projects
 * Crea un nuevo proyecto
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validar límite de proyectos
    const canCreate = await canCreateProject(session.user.id);
    if (!canCreate) {
      return NextResponse.json(
        { error: "Has alcanzado el límite de 10 proyectos" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { title, description, stack } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "El título es requerido" },
        { status: 400 },
      );
    }

    const project = await prisma.project.create({
      data: {
        userId: session.user.id,
        title: title.trim(),
        description: description?.trim() || null,
        stack: stack?.trim() || null,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}
