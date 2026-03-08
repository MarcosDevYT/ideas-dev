"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Plan } from "@prisma/client";
import { getPublicPlansAction } from "@/actions/plans/plan-actions";
import { createCheckoutSessionAction } from "@/actions/polar/checkout-actions";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UpgradePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activePlanId?: string;
}

export function UpgradePlanDialog({
  open,
  onOpenChange,
  activePlanId, // TODO: comparar con polarProductId o id
}: UpgradePlanDialogProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && plans.length === 0) {
      getPublicPlansAction().then((res) => {
        if (res.success && res.subscriptions) {
          setPlans(res.subscriptions);
        }
        setLoading(false);
      });
    }
  }, [open, plans.length]);

  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const handleUpgrade = async (plan: Plan) => {
    // Si ya estamos en este plan, cerramos el dialogo
    if (
      activePlanId &&
      (plan.id === activePlanId || plan.polarProductId === activePlanId)
    ) {
      onOpenChange(false);
      return;
    }

    if (!plan.polarProductId) {
      toast.error("Este plan no tiene un producto de facturación asociado.");
      return;
    }

    setCheckoutLoading(plan.id);
    const result = await createCheckoutSessionAction(plan.polarProductId);

    if (result.success && result.url) {
      window.location.assign(result.url); // Redirige a Polar Checkout
    } else {
      toast.error(result.error || "No se pudo iniciar el proceso de pago");
      setCheckoutLoading(null);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-200px)] w-full sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Mejora tu Plan</DialogTitle>
          <DialogDescription>
            Elige un plan que se ajuste a tus necesidades y desbloquea más
            funciones.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="text-muted-foreground animate-pulse">
              Cargando planes...
            </span>
          </div>
        ) : (
          <div className="grid gap-4 py-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 max-h-[calc(100vh-200px)] overflow-y-auto px-2">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`mx-auto w-76 sm:w-full md:w-76 lg:w-full p-6 relative flex flex-col ${
                  plan.isPopular ? "border-primary shadow-lg" : ""
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    Popular
                  </div>
                )}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {plan.credits} créditos mensuales
                  </p>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features?.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm"
                    >
                      <Check className="size-4 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full mt-auto"
                  variant={plan.isPopular ? "default" : "outline"}
                  disabled={
                    plan.id === activePlanId ||
                    plan.polarProductId === activePlanId ||
                    checkoutLoading !== null
                  }
                  onClick={() => handleUpgrade(plan)}
                >
                  {checkoutLoading === plan.id
                    ? "Redirigiendo..."
                    : plan.id === activePlanId ||
                        plan.polarProductId === activePlanId
                      ? "Plan Actual"
                      : plan.price === 0
                        ? "Ver plan gratuito"
                        : "Actualizar Plan"}
                </Button>
              </Card>
            ))}
          </div>
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
