import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Coins, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import {
  getTransactionIcon,
  getTransactionTypeName,
} from "@/actions/credits/constants";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { PurchaseCreditsButton } from "./purchase-credits-button";
import type { CreditsData } from "@/actions/credits";

interface CreditsPanelProps {
  initialData: CreditsData;
  userId: string;
}

export function CreditsPanel({ initialData }: CreditsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          Mis Créditos
        </CardTitle>
        <CardDescription>
          Gestiona tus créditos y revisa tu historial de transacciones
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Balance Actual */}
        <div className="rounded-lg border bg-muted/50 p-6">
          <p className="text-sm text-muted-foreground mb-2">Balance Actual</p>
          <p className="text-4xl font-bold">
            {initialData.isAdmin ? "∞" : initialData.credits.toLocaleString()}
            {!initialData.isAdmin && (
              <span className="text-lg text-muted-foreground ml-2">
                créditos totales
              </span>
            )}
          </p>
          {!initialData.isAdmin && (
            <div className="flex flex-col sm:flex-row gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5 bg-background border px-3 py-1.5 rounded-md">
                <span className="w-2 h-2 rounded-full bg-primary/70"></span>
                <span>
                  Plan Mensual:{" "}
                  <strong className="text-foreground">
                    {initialData.planCredits.toLocaleString()}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-background border px-3 py-1.5 rounded-md">
                <span className="w-2 h-2 rounded-full bg-blue-500/70"></span>
                <span>
                  Extra (No expiran):{" "}
                  <strong className="text-foreground">
                    {initialData.extraCredits.toLocaleString()}
                  </strong>
                </span>
              </div>
            </div>
          )}
          {initialData.isAdmin && (
            <p className="text-sm text-muted-foreground mt-1">
              Créditos ilimitados (Admin)
            </p>
          )}
        </div>

        {/* Estadísticas */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            📊 Estadísticas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <TrendingDown className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-xs text-muted-foreground">Consumidos</p>
                <p className="text-xl font-semibold">
                  {initialData.stats.totalConsumed}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">Comprados</p>
                <p className="text-xl font-semibold">
                  {initialData.stats.totalPurchased}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Calendar className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">Última compra</p>
                <p className="text-sm font-medium">
                  {initialData.stats.lastPurchase
                    ? formatDistanceToNow(
                        new Date(initialData.stats.lastPurchase),
                        {
                          addSuffix: true,
                          locale: es,
                        },
                      )
                    : "Nunca"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de Compra - Client Component */}
        <PurchaseCreditsButton />

        <Separator />

        {/* Transacciones Recientes */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            📜 Transacciones Recientes
          </h3>
          {initialData.recentTransactions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay transacciones aún
            </p>
          ) : (
            <div className="space-y-2">
              {initialData.recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {getTransactionIcon(transaction.type)}
                    </span>
                    <div>
                      <p className="text-sm font-medium">
                        {transaction.description ||
                          getTransactionTypeName(transaction.type)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(transaction.createdAt), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-semibold ${
                      transaction.amount > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.amount > 0 ? "+" : ""}
                    {transaction.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
