import { getAdminBugsAction } from "@/actions/admin-bugs-actions";
import { BugsClient } from "@/components/admin/bugs-client";

export const metadata = {
  title: "Gestión de Bugs — Panel Admin",
};

export default async function AdminBugsPage() {
  const result = await getAdminBugsAction();

  if (!result.success || !result.bugs) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed">
        <h2 className="text-xl font-semibold mb-2">
          ❌ No se pudieron cargar los reportes
        </h2>
        <p className="text-muted-foreground">{result.error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Reportes de Bugs</h2>
        <p className="text-muted-foreground">
          Visualiza los reportes enviados por los usuarios y actualiza su
          progreso de resolución.
        </p>
      </div>

      <BugsClient initialBugs={result.bugs} />
    </div>
  );
}
