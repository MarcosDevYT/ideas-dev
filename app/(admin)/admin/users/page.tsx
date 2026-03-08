import { getAdminUsersAction } from "@/actions/admin-users-actions";
import { UsersClient } from "@/components/admin/users-client";

export const metadata = {
  title: "Gestión de Usuarios — Panel Admin",
};

export default async function AdminUsersPage() {
  const result = await getAdminUsersAction();

  if (!result.success || !result.users) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed">
        <h2 className="text-xl font-semibold mb-2">
          ❌ No se pudieron cargar los usuarios
        </h2>
        <p className="text-muted-foreground">{result.error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Gestión de Usuarios
        </h2>
        <p className="text-muted-foreground">
          Visualiza todos los usuarios y modifica sus balances de créditos.
        </p>
      </div>

      <UsersClient initialUsers={result.users} />
    </div>
  );
}
