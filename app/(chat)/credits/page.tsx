import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CreditsPanel } from "@/components/credits/credits-panel";
import { TransactionsHistory } from "@/components/credits/transactions-history";
import { Separator } from "@/components/ui/separator";
import {
  getCreditsDataAction,
  getTransactionsAction,
} from "@/lib/actions/credits-actions";

export default async function CreditsPage() {
  // Verificar autenticación
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch paralelo - elimina waterfalls
  const [creditsData, transactionsData] = await Promise.all([
    getCreditsDataAction(session.user.id),
    getTransactionsAction({ userId: session.user.id, page: 1, limit: 20 }),
  ]);

  return (
    <div className="container max-w-6xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Créditos</h1>
        <p className="text-muted-foreground mt-2">
          Administra tus créditos y revisa tu historial de transacciones
        </p>
      </div>

      <CreditsPanel initialData={creditsData} userId={session.user.id} />

      <Separator />

      <TransactionsHistory
        initialData={transactionsData}
        userId={session.user.id}
      />
    </div>
  );
}
