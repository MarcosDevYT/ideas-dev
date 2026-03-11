"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatePlanButton } from "@/components/layout/admin/CreatePlanButton";
import { EditPlanButton } from "@/components/layout/admin/EditPlanButton";
import { ClonePlanButton } from "@/components/layout/admin/ClonePlanButton";
import { DeletePlanButton } from "@/components/layout/admin/DeletePlanButton";
import { EnvironmentFilter } from "@/components/layout/admin/EnvironmentFilter";
import { Check, Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plan } from "@prisma/client";

interface PlansPageClientProps {
  subscriptions: Plan[];
  creditPackages: Plan[];
}

export function PlansPageClient({ subscriptions, creditPackages }: PlansPageClientProps) {
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
        <div className="flex items-center gap-4">
          <EnvironmentFilter />
          <CreatePlanButton />
        </div>
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
              <Card
                key={sub.id}
                className={`pb-4 rounded-xl relative ${
                  sub.isPopular ? "border-primary shadow-md" : "border-border"
                }`}
              >
                {sub.isPopular && (
                  <div className="absolute -top-3 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> Popular
                  </div>
                )}
                <CardHeader className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl">{sub.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {sub.description}
                    </p>
                    <span
                      className={`inline-block mt-2 px-2 py-0.5 text-xs font-semibold rounded-md ${
                        sub.polarEnvironment === "production"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                      }`}
                    >
                      {sub.polarEnvironment.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold">${sub.price}</span>
                    <span className="text-sm text-muted-foreground block">
                      /mes
                    </span>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-3 mb-4 text-center">
                    <span className="font-semibold">{sub.credits}</span>{" "}
                    créditos mensuales
                  </div>

                  {sub.features && sub.features.length > 0 && (
                    <ul className="space-y-2 mt-4">
                      {sub.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex flex-col gap-2 mt-4">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <EditPlanButton plan={sub} />
                      </div>
                      <div className="flex-1">
                        <ClonePlanButton plan={sub} />
                      </div>
                    </div>
                    <DeletePlanButton plan={sub} />
                  </div>
                </CardContent>
              </Card>
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
              <Card
                key={pkg.id}
                className={`pb-4 rounded-xl relative ${
                  pkg.isPopular ? "border-primary shadow-md" : "border-border"
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> Popular
                  </div>
                )}
                <CardHeader className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl">{pkg.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {pkg.description}
                    </p>
                    <span
                      className={`inline-block mt-2 px-2 py-0.5 text-xs font-semibold rounded-md ${
                        pkg.polarEnvironment === "production"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                      }`}
                    >
                      {pkg.polarEnvironment.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold">${pkg.price}</span>
                    <span className="text-sm text-muted-foreground block">
                      un solo pago
                    </span>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-3 mb-4 text-center">
                    <span className="font-semibold">{pkg.credits}</span> extra
                    créditos
                  </div>

                  {pkg.features && pkg.features.length > 0 && (
                    <ul className="space-y-2 mt-4">
                      {pkg.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex flex-col gap-2 mt-4">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <EditPlanButton plan={pkg} />
                      </div>
                      <div className="flex-1">
                        <ClonePlanButton plan={pkg} />
                      </div>
                    </div>
                    <DeletePlanButton plan={pkg} />
                  </div>
                </CardContent>
              </Card>
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
