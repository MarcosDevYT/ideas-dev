import {
  Users,
  CreditCard,
  Sparkles,
  Bug,
  DollarSign,
  UserPlus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminOverviewProps {
  activeSubscriptions: number;
  newUsers: number;
  aiUsage: number;
  revenue: number;
}

const metricConfig = [
  {
    key: "revenue" as const,
    label: "Ingresos Brutos",
    icon: DollarSign,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    description: "Volumen histórico total",
    prefix: "$",
  },
  {
    key: "activeSubscriptions" as const,
    label: "Suscripciones Activas",
    icon: CreditCard,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    description: "Planes recurrentes vigentes",
  },
  {
    key: "newUsers" as const,
    label: "Usuarios Nuevos",
    icon: UserPlus,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    description: "Últimos 30 días",
  },
  {
    key: "aiUsage" as const,
    label: "Uso de API (IA)",
    icon: Sparkles,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    description: "Respuestas generadas por IA",
  },
];

export function AdminOverview({
  activeSubscriptions,
  newUsers,
  aiUsage,
  revenue,
}: AdminOverviewProps) {
  const values: Record<string, number> = {
    activeSubscriptions,
    newUsers,
    aiUsage,
    revenue,
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
                  {metric.prefix}
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
