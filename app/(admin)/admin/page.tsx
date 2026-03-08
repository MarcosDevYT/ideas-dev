import prisma from "@/lib/prisma";
import { AdminOverview } from "@/components/layout/admin/admin-overview";

export const metadata = {
  title: "Panel de Administración — IdeasDev",
};

async function getAdminStats() {
  const [totalUsers, activeSubscriptions, openBugReports, creditStats] =
    await Promise.all([
      prisma.user.count(),
      prisma.subscription.count({
        where: { status: "active" },
      }),
      prisma.bugReport.count({
        where: { status: "OPEN" },
      }),
      prisma.user.aggregate({
        _sum: { extraCredits: true },
      }),
    ]);

  return {
    totalUsers,
    activeSubscriptions,
    openBugReports,
    totalExtraCredits: creditStats._sum.extraCredits ?? 0,
  };
}

export default async function AdminPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Bienvenido al panel admin
        </h2>
        <p className="text-muted-foreground">
          Resumen del estado actual de la plataforma IdeasDev.
        </p>
      </div>

      <AdminOverview
        totalUsers={stats.totalUsers}
        activeSubscriptions={stats.activeSubscriptions}
        totalExtraCredits={stats.totalExtraCredits}
        openBugReports={stats.openBugReports}
      />
    </div>
  );
}
