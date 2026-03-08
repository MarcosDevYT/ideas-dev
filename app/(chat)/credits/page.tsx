import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CreditsPanel } from "@/components/credits/credits-panel";
import { TransactionsHistory } from "@/components/credits/transactions-history";
import { Separator } from "@/components/ui/separator";
import { getCreditsDataAction, getTransactionsAction } from "@/actions/credits";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

async function CreditsDataWrapper({ userId }: { userId: string }) {
  const [creditsData, transactionsData] = await Promise.all([
    getCreditsDataAction(userId),
    getTransactionsAction({ userId, page: 1, limit: 20 }),
  ]);

  return (
    <>
      <CreditsPanel initialData={creditsData} userId={userId} />
      <Separator />
      <TransactionsHistory initialData={transactionsData} userId={userId} />
    </>
  );
}

function LoadingCredits() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-muted-foreground w-full border rounded-lg bg-card/50">
      <Loader2 className="h-8 w-8 animate-spin mb-4" />
      <p>Cargando información de tus créditos...</p>
    </div>
  );
}

export default async function CreditsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Créditos</h1>
        <p className="text-muted-foreground mt-2">
          Administra tus créditos y revisa tu historial de transacciones
        </p>
      </div>

      <Suspense fallback={<LoadingCredits />}>
        <CreditsDataWrapper userId={session.user.id} />
      </Suspense>
    </div>
  );
}
