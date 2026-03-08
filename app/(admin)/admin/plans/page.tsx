import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDbPlansAction } from "@/actions/plans/plan-actions";
import { CreatePlanButton } from "@/components/layout/admin/CreatePlanButton";
import { EditPlanButton } from "@/components/layout/admin/EditPlanButton";
import { Check, Star } from "lucide-react";

export const metadata = {
  title: "Planes — Admin IdeasDev",
};

export default async function AdminPlansPage() {
  const result = await getDbPlansAction();

  const subscriptions = result.success ? result.subscriptions || [] : [];
  const creditPackages = result.success ? result.creditPackages || [] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Planes y Créditos
          </h2>
          <p className="text-muted-foreground">
            Administra los planes de suscripción y paquetes de créditos
            gestionados en Polar.
          </p>
        </div>
        <CreatePlanButton />
      </div>

      <Tabs defaultValue="subscriptions" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="subscriptions">
            Suscripciones ({subscriptions.length})
          </TabsTrigger>
          <TabsTrigger value="credits">
            Créditos ({creditPackages.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className={`p-6 rounded-xl border bg-card relative ${
                  sub.isPopular ? "border-primary shadow-md" : "border-border"
                }`}
              >
                {sub.isPopular && (
                  <div className="absolute -top-3 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> Popular
                  </div>
                )}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl">{sub.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {sub.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold">${sub.price}</span>
                    <span className="text-sm text-muted-foreground block">
                      /mes
                    </span>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-3 mb-4 text-center">
                  <span className="font-semibold">{sub.credits}</span> créditos
                  mensuales
                </div>

                {sub.features && sub.features.length > 0 && (
                  <ul className="space-y-2 mt-4">
                    {sub.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <EditPlanButton plan={sub} />
              </div>
            ))}
            {subscriptions.length === 0 && (
              <p className="text-muted-foreground text-sm col-span-full text-center py-8">
                No hay suscripciones creadas en la base de datos.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="credits" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {creditPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`p-6 rounded-xl border bg-card relative ${
                  pkg.isPopular ? "border-primary shadow-md" : "border-border"
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> Popular
                  </div>
                )}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl">{pkg.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {pkg.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold">${pkg.price}</span>
                    <span className="text-sm text-muted-foreground block">
                      un solo pago
                    </span>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-3 mb-4 text-center">
                  <span className="font-semibold">{pkg.credits}</span> extra
                  créditos
                </div>

                {pkg.features && pkg.features.length > 0 && (
                  <ul className="space-y-2 mt-4">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <EditPlanButton plan={pkg} />
              </div>
            ))}
            {creditPackages.length === 0 && (
              <p className="text-muted-foreground text-sm col-span-full text-center py-8">
                No hay paquetes de créditos creados en la base de datos.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
