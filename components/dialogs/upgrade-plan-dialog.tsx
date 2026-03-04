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
import { toast } from "sonner";
import { useTransition } from "react";
import { useSession } from "next-auth/react";
import { upgradeUserPlanAction } from "@/actions/credits";
import { SUBSCRIPTION_PLANS, PlanId } from "@/actions/credits/constants";

interface UpgradePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activePlanId?: PlanId; // Plan ID passed from parent
}

export function UpgradePlanDialog({
  open,
  onOpenChange,
  activePlanId,
}: UpgradePlanDialogProps) {
  const plans = Object.values(SUBSCRIPTION_PLANS);
  const [isPending, startTransition] = useTransition();
  const { data: session, update } = useSession();

  const currentPriceId = session?.user?.subscription?.stripePriceId || "";
  let sessionPlanId: PlanId = "FREE";
  if (session?.user?.subscription?.status === "active") {
    if (currentPriceId.includes("basic")) sessionPlanId = "BASIC";
    else if (currentPriceId.includes("pro")) sessionPlanId = "PRO";
    else if (currentPriceId.includes("premium")) sessionPlanId = "PREMIUM";
  }

  const currentPlanId = activePlanId || sessionPlanId;

  const handleUpgrade = (planId: PlanId) => {
    if (planId === "FREE") {
      onOpenChange(false);
      return;
    }

    startTransition(async () => {
      const toastId = toast.loading("Actualizando plan...");
      const result = await upgradeUserPlanAction(planId);
      toast.dismiss(toastId);

      if (result.success) {
        await update(); // Refresca la sesión en tiempo real
        toast.success(
          `Plan actualizado a ${SUBSCRIPTION_PLANS[planId].name} correctamente`,
        );
        onOpenChange(false);
      } else {
        toast.error("Hubo un error al actualizar el plan");
      }
    });
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
        <div className="grid gap-4 py-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 max-h-[calc(100vh-200px)] overflow-y-auto px-2">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`mx-auto w-76 sm:w-full md:w-76 lg:w-full p-6 relative ${
                plan.popular ? "border-primary shadow-lg" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  Popular
                </div>
              )}
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {plan.credits}
                </p>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="size-4 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full mt-auto"
                variant={plan.popular ? "default" : "outline"}
                disabled={isPending || plan.id === currentPlanId}
                onClick={() => handleUpgrade(plan.id)}
              >
                {plan.id === currentPlanId
                  ? "Plan Actual"
                  : plan.id === "FREE"
                    ? "Cancelar suscripción"
                    : "Mejorar"}
              </Button>
            </Card>
          ))}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
