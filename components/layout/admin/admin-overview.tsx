import { Users, CreditCard, Coins, Bug } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminOverviewProps {
  totalUsers: number;
  activeSubscriptions: number;
  totalExtraCredits: number;
  openBugReports: number;
}

const metricConfig = [
  {
    key: "totalUsers" as const,
    label: "Total Usuarios",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    description: "Usuarios registrados",
  },
  {
    key: "activeSubscriptions" as const,
    label: "Suscripciones Activas",
    icon: CreditCard,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    description: "Planes activos en este momento",
  },
  {
    key: "totalExtraCredits" as const,
    label: "Créditos Extra Totales",
    icon: Coins,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    description: "Créditos extra entre todos los usuarios",
  },
  {
    key: "openBugReports" as const,
    label: "Bug Reports Abiertos",
    icon: Bug,
    color: "text-red-500",
    bg: "bg-red-500/10",
    description: "Reportes pendientes de resolver",
  },
];

export function AdminOverview({
  totalUsers,
  activeSubscriptions,
  totalExtraCredits,
  openBugReports,
}: AdminOverviewProps) {
  const values: Record<string, number> = {
    totalUsers,
    activeSubscriptions,
    totalExtraCredits,
    openBugReports,
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">Métricas Generales</h2>
        <p className="text-sm text-muted-foreground">
          Vista general del estado actual de la plataforma.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metricConfig.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card
              key={metric.key}
              className="border-border/60 hover:border-border transition-colors"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
                <div className={`p-2 rounded-lg ${metric.bg}`}>
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold tracking-tight">
                  {values[metric.key].toLocaleString("es-AR")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
