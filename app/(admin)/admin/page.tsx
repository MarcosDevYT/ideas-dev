import { AdminOverview } from "@/components/layout/admin/admin-overview";
import { getAdminStatsAction } from "@/actions/admin-stats-actions";

export const metadata = {
  title: "Panel de Administración — IdeasDev",
};

export default async function AdminPage() {
  const result = await getAdminStatsAction();

  if (!result.success) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed">
        <h2 className="text-xl font-semibold mb-2">
          ❌ Error al cargar métricas
        </h2>
        <p className="text-muted-foreground">{result.error}</p>
      </div>
    );
  }

  const { stats } = result;

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
        activeSubscriptions={stats.activeSubscriptions}
        newUsers={stats.newUsers}
        aiUsage={stats.aiUsage}
        revenue={stats.revenue}
      />
    </div>
  );
}
