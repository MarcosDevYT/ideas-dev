"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { polar } from "@/lib/polar";
import { getCachedData, invalidateCacheKey } from "@/actions/cache/redis-cache";

function isAdmin(email: string | null | undefined) {
  return email === process.env.ADMIN_EMAIL;
}

export type AdminStats = {
  totalUsers: number;
  activeSubscriptions: number;
  openBugReports: number;
  newUsers: number;
  aiUsage: number;
  revenue: number;
};

// TTL de 10 minutos — métricas del dashboard no necesitan ser en tiempo real
const STATS_TTL = 600;
const STATS_CACHE_KEY = "admin:dashboard-stats";

export async function getAdminStatsAction(): Promise<
  { success: true; stats: AdminStats } | { success: false; error: string }
> {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) {
    return { success: false, error: "No autorizado" };
  }

  try {
    const stats = await getCachedData<AdminStats>(
      STATS_CACHE_KEY,
      async () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const [
          totalUsers,
          activeSubscriptions,
          openBugReports,
          newUsers,
          aiUsage,
        ] = await Promise.all([
          prisma.user.count(),
          prisma.subscription.count({ where: { status: "active" } }),
          prisma.bugReport.count({ where: { status: "OPEN" } }),
          prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
          prisma.message.count({ where: { role: "assistant" } }),
        ]);

        let revenue = 0;
        try {
          const response = await polar.orders.list({ limit: 100 });
          revenue =
            response.result?.items?.reduce(
              (acc, order) => acc + (order.netAmount || 0),
              0,
            ) / 100 || 0;
        } catch (err) {
          console.error("Error al obtener órdenes de Polar:", err);
        }

        return {
          totalUsers,
          activeSubscriptions,
          openBugReports,
          newUsers,
          aiUsage,
          revenue,
        };
      },
      STATS_TTL,
    );

    return { success: true, stats };
  } catch (error) {
    console.error("Error obteniendo estadísticas del admin:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

/**
 * Invalida el caché de métricas del admin manualmente.
 * Útil tras cambios estructurales o ajustes masivos.
 */
export async function invalidateAdminStatsCache() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return;
  await invalidateCacheKey(STATS_CACHE_KEY);
}
