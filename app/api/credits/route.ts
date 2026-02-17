import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getCreditBalance, getCreditStats } from "@/actions/credits/service";
import prisma from "@/lib/prisma";

/**
 * GET /api/credits
 * Obtiene información de créditos del usuario actual
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Obtener créditos actuales
    const balance = await getCreditBalance(session.user.id);
    const credits = balance.isAdmin ? Infinity : balance.available;

    // Obtener estadísticas
    const stats = await getCreditStats(session.user.id);

    // Obtener transacciones recientes (últimas 5)
    const recentTransactions = await prisma.creditTransaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        amount: true,
        type: true,
        description: true,
        createdAt: true,
      },
    });

    // Verificar si es admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true },
    });

    return NextResponse.json({
      credits,
      isAdmin: user?.isAdmin || false,
      stats,
      recentTransactions,
    });
  } catch (error) {
    console.error("Error al obtener créditos:", error);
    return NextResponse.json(
      { error: "Error al obtener información de créditos" },
      { status: 500 },
    );
  }
}
