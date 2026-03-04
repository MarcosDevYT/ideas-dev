import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { enrichTransactionsWithTitles } from "@/actions/credits/service";

/**
 * GET /api/credits/transactions
 * Obtiene el historial de transacciones del usuario con paginación
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const type = searchParams.get("type"); // Filtro opcional por tipo

    // Validar parámetros
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Parámetros inválidos" },
        { status: 400 },
      );
    }

    // Construir filtro
    const where: { userId: string; type?: string } = {
      userId: session.user.id,
    };
    if (type) {
      where.type = type;
    }

    // Obtener total de transacciones
    const total = await prisma.creditTransaction.count({ where });

    // Obtener transacciones paginadas
    const transactions = await prisma.creditTransaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        amount: true,
        type: true,
        description: true,
        createdAt: true,
      },
    });

    const enrichedTransactions =
      await enrichTransactionsWithTitles(transactions);

    return NextResponse.json({
      transactions: enrichedTransactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error al obtener transacciones:", error);
    return NextResponse.json(
      { error: "Error al obtener historial de transacciones" },
      { status: 500 },
    );
  }
}
